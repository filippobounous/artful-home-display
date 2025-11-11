import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddItemBasicInfo } from './AddItemBasicInfo';
import { AddItemLocationValuation } from './AddItemLocationValuation';
import { AddItemDescriptionNotes } from './AddItemDescriptionNotes';
import { AddItemImages } from './AddItemImages';
import { useToast } from '@/hooks/use-toast';
import {
  getCreateItemFn,
  getUpdateItemFn,
  getItemFetcher,
  getItemToInputConverter,
} from '@/lib/api/items';
import type {
  CollectionType,
  DecorItem,
  DecorItemInput,
  InventoryItem,
  InventoryItemInput,
  BookItem,
  BookItemInput,
  MusicItem,
  MusicItemInput,
} from '@/types/inventory';
import type {
  DecorItemFormData,
  BookItemFormData,
  MusicItemFormData,
} from '@/types/forms';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsState } from '@/hooks/useSettingsState';
import { useCollection } from '@/context/CollectionProvider';
import { format } from 'date-fns';

const draftStorageKey = (collection: CollectionType) => `drafts-${collection}`;
const editingDraftKey = (collection: CollectionType) =>
  `editingDraft-${collection}`;
const inventoryStorageKeyFor = (collection: CollectionType) =>
  `inventoryData-${collection}`;

type DraftEntry<T> = {
  id: number;
  lastModified: string;
  data: T;
  title: string;
  category?: string;
  description?: string;
  isExistingItem?: boolean;
  collection: CollectionType;
};

function validateDecorFields(data: DecorItemFormData) {
  const errs: Record<string, string> = {};
  if (!data.name.trim()) errs.name = 'Name is required';
  if (!data.room_code.trim()) errs.room_code = 'Room is required';
  if (!data.creator.trim()) errs.creator = 'Creator is required';
  if (!data.origin_region.trim()) errs.origin_region = 'Origin region is required';
  if (!data.date_period.toString().trim())
    errs.date_period = 'Date period is required';
  if (!data.category.trim()) errs.category = 'Category is required';
  if (!data.subcategory.trim()) errs.subcategory = 'Subcategory is required';
  if (!data.quantity || Number(data.quantity) <= 0)
    errs.quantity = 'Quantity must be greater than 0';

  return errs;
}

function ArtAddItemForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const draftId = searchParams.get('draftId');
  const collection: CollectionType = 'art';
  const createItem = getCreateItemFn(collection);
  const updateItem = getUpdateItemFn(collection);
  const fetchItem = getItemFetcher(collection);
  const toInput = getItemToInputConverter(collection);
  const draftKey = draftStorageKey(collection);
  const editingKey = editingDraftKey(collection);
  const inventoryKey = inventoryStorageKeyFor(collection);

  const [formData, setFormData] = useState<DecorItemFormData & { images: string[] }>(
    () => ({
      code: '',
      name: '',
      creator: '',
      origin_region: '',
      date_period: '',
      material: '',
      width_cm: '',
      height_cm: '',
      depth_cm: '',
      weight_kg: '',
      provenance: '',
      category: '',
      subcategory: '',
      quantity: '1',
      house: '',
      room: '',
      room_code: '',
      acquisition_date: undefined,
      acquisition_value: '',
      acquisition_currency: 'EUR',
      appraisal_date: undefined,
      appraisal_value: '',
      appraisal_currency: 'EUR',
      appraisal_entity: '',
      description: '',
      notes: '',
      images: [],
    }),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExistingItem, setIsExistingItem] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!draftId) {
        setIsExistingItem(false);
        return;
      }
      const stored = localStorage.getItem(editingKey);
      let draft:
        | (DecorItemInput & {
            lastModified?: string;
            isExistingItem?: boolean;
          })
        | null = null;
      let existingItem: DecorItem | null = null;
      let fetchAttempted = false;
      let inventoryItems: DecorItem[] = [];
      if (stored) {
        try {
          draft = JSON.parse(stored) as DecorItemInput;
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        try {
          inventoryItems = JSON.parse(
            localStorage.getItem(inventoryKey) || '[]',
          ) as DecorItem[];
          const item = inventoryItems.find(
            (i: DecorItem) => i.id === Number(draftId),
          );
          if (item) {
            draft = toInput(item) as DecorItemInput;
            existingItem = item;
          }
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        const item = (await fetchItem(Number(draftId))) as DecorItem | null;
        fetchAttempted = true;
        if (item) {
          draft = toInput(item) as DecorItemInput;
          existingItem = item;
        }
      }
      if (draft) {
        const acquisitionDate = draft.acquisition_date
          ? new Date(draft.acquisition_date)
          : undefined;
        const appraisalDate = draft.appraisal_date
          ? new Date(draft.appraisal_date)
          : undefined;

        const loaded = {
          code: draft.code || '',
          name: draft.name || '',
          creator: draft.creator || '',
          origin_region: draft.origin_region || '',
          date_period: String(draft.date_period || ''),
          material: draft.material || '',
          width_cm: draft.width_cm ? String(draft.width_cm) : '',
          height_cm: draft.height_cm ? String(draft.height_cm) : '',
          depth_cm: draft.depth_cm ? String(draft.depth_cm) : '',
          weight_kg: draft.weight_kg ? String(draft.weight_kg) : '',
          provenance: draft.provenance || '',
          category: draft.category || '',
          subcategory: draft.subcategory || '',
          quantity: String(draft.quantity || '1'),
          house: draft.house || '',
          room: draft.room || '',
          room_code: draft.room_code || '',
          acquisition_date: acquisitionDate,
          acquisition_value: draft.acquisition_value
            ? String(draft.acquisition_value)
            : '',
          acquisition_currency: draft.acquisition_currency || 'EUR',
          appraisal_date: appraisalDate,
          appraisal_value: draft.appraisal_value
            ? String(draft.appraisal_value)
            : '',
          appraisal_currency: draft.appraisal_currency || 'EUR',
          appraisal_entity: draft.appraisal_entity || '',
          description: draft.description || '',
          notes: draft.notes || '',
          images: [],
        };

        setFormData(loaded);
        setErrors(validateDecorFields(loaded));

        let existing = false;
        if (typeof draft.isExistingItem === 'boolean') {
          existing = draft.isExistingItem;
        } else if (existingItem) {
          existing = true;
        } else if (draftId) {
          const idToMatch = Number(draftId);
          const itemsToCheck = inventoryItems.length
            ? inventoryItems
            : (() => {
                try {
                  return JSON.parse(
                    localStorage.getItem(inventoryKey) || '[]',
                  ) as DecorItem[];
                } catch {
                  return [] as DecorItem[];
                }
              })();
          existing = itemsToCheck.some((item) => item.id === idToMatch);

          if (!existing && !fetchAttempted) {
            const fetched = (await fetchItem(Number(draftId))) as
              | DecorItem
              | null;
            fetchAttempted = true;
            existing = !!fetched;
          }
        }

        setIsExistingItem(existing);

        localStorage.removeItem(editingKey);

        if ('lastModified' in draft) {
          toast({
            title: 'Draft loaded',
            description: 'Your draft has been loaded successfully',
          });
        } else {
          toast({
            title: 'Edit mode',
            description: 'Item data loaded for editing',
          });
        }
      } else {
        setIsExistingItem(false);
      }
    }
    loadData();
  }, [draftId, toast, fetchItem, inventoryKey, editingKey, toInput]);

  useEffect(() => {
    if (!draftId) {
      setIsExistingItem(false);
    }
  }, [draftId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateDecorFields(formData);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.acquisition_date && formData.acquisition_date > today)
      newErrors.acquisition_date = 'Acquisition date cannot be in the future';
    if (formData.appraisal_date && formData.appraisal_date > today)
      newErrors.appraisal_date = 'Appraisal date cannot be in the future';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Please fix the errors',
        description: 'Some required fields are missing or invalid',
        variant: 'destructive',
      });
      return;
    }
    setErrors({});

    const decorItem = {
      code: formData.code || undefined,
      name: formData.name,
      room_code: formData.room_code,
      house: formData.house || undefined,
      room: formData.room || undefined,
      creator: formData.creator,
      origin_region: formData.origin_region,
      date_period: formData.date_period,
      material: formData.material || undefined,
      height_cm: formData.height_cm ? Number(formData.height_cm) : undefined,
      width_cm: formData.width_cm ? Number(formData.width_cm) : undefined,
      depth_cm: formData.depth_cm ? Number(formData.depth_cm) : undefined,
      weight_kg: formData.weight_kg ? Number(formData.weight_kg) : undefined,
      provenance: formData.provenance || undefined,
      category: formData.category,
      subcategory: formData.subcategory,
      quantity: formData.quantity ? Number(formData.quantity) : 1,
      acquisition_date: formData.acquisition_date
        ? format(formData.acquisition_date, 'yyyy-MM-dd')
        : undefined,
      acquisition_value: formData.acquisition_value
        ? Number(formData.acquisition_value)
        : undefined,
      acquisition_currency: formData.acquisition_currency || undefined,
      appraisal_date: formData.appraisal_date
        ? format(formData.appraisal_date, 'yyyy-MM-dd')
        : undefined,
      appraisal_value: formData.appraisal_value
        ? Number(formData.appraisal_value)
        : undefined,
      appraisal_currency: formData.appraisal_currency || undefined,
      appraisal_entity: formData.appraisal_entity || undefined,
      description: formData.description || undefined,
      notes: formData.notes || undefined,
      is_deleted: false,
    } as DecorItemInput;

    let saveAction: Promise<InventoryItem>;

    if (draftId && isExistingItem) {
      saveAction = updateItem(
        Number(draftId),
        decorItem as unknown as InventoryItemInput,
      );
    } else {
      saveAction = createItem(decorItem as unknown as InventoryItemInput);
    }

    saveAction
      .then(() => {
        if (draftId) {
          const drafts = JSON.parse(localStorage.getItem(draftKey) || '[]');
          const filtered = drafts.filter(
            (d: { id: number }) => d.id !== Number(draftId),
          );
          localStorage.setItem(draftKey, JSON.stringify(filtered));
        }

        toast({
          title: draftId && isExistingItem ? 'Item updated' : 'Item added',
          description:
            draftId && isExistingItem
              ? 'Your item has been updated successfully'
              : 'Your item has been added to the collection successfully',
        });

        navigate('/inventory');
      })
      .catch((error) => {
        console.error('Error saving item:', error);
        toast({
          title: 'Error saving item',
          description: 'There was a problem saving your changes',
          variant: 'destructive',
        });
      });
  };

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem(draftKey) || '[]');
    const id = draftId ? Number(draftId) : Date.now();
    const newDraft: DraftEntry<DecorItemFormData & { images: string[] }> = {
      id,
      lastModified: new Date().toISOString().split('T')[0],
      data: formData,
      title: formData.name || 'Untitled Draft',
      category: formData.category,
      description: formData.description || '',
      isExistingItem,
      collection,
    };
    const filtered = drafts.filter((d: { id: number }) => d.id !== id);
    localStorage.setItem(draftKey, JSON.stringify([...filtered, newDraft]));
    toast({
      title: 'Draft saved',
      description: 'You can continue editing this draft later',
    });
    navigate('/drafts');
  };

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="h-full">
              <AddItemBasicInfo
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>

            <div className="h-full">
              <AddItemLocationValuation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          </div>

          <AddItemImages
            formData={formData}
            setFormData={setFormData}
          />

          <AddItemDescriptionNotes
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex gap-4 pt-6 max-w-2xl mx-auto">
            <Button type="submit" className="flex-1 h-12 text-lg font-semibold">
              {draftId ? 'Save Changes' : 'Add to Collection'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex-1 h-12 text-lg font-semibold"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const defaultBookFormData: BookItemFormData = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  genre: '',
  pageCount: '',
  publicationYear: '',
  quantity: '1',
  house: '',
  room: '',
  valuation: '',
  valuationCurrency: 'USD',
  valuationDate: '',
  description: '',
  notes: '',
};

const defaultMusicFormData: MusicItemFormData = {
  title: '',
  artist: '',
  album: '',
  format: '',
  genre: '',
  releaseYear: '',
  trackCount: '',
  quantity: '1',
  house: '',
  room: '',
  valuation: '',
  valuationCurrency: 'USD',
  valuationDate: '',
  description: '',
  notes: '',
};

const parseNumber = (value: string) => {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const bookFormDataFromInput = (input: BookItemInput): BookItemFormData => ({
  title: input.title ?? '',
  author: input.author ?? '',
  publisher: input.publisher ?? '',
  isbn: input.isbn ?? '',
  genre: input.genre ?? '',
  pageCount: input.pageCount ? String(input.pageCount) : '',
  publicationYear: input.publicationYear ? String(input.publicationYear) : '',
  quantity: input.quantity ? String(input.quantity) : '1',
  house: input.house ?? '',
  room: input.room ?? '',
  valuation: input.valuation ? String(input.valuation) : '',
  valuationCurrency: input.valuationCurrency ?? 'USD',
  valuationDate: input.valuationDate ?? '',
  description: input.description ?? '',
  notes: input.notes ?? '',
});

const musicFormDataFromInput = (input: MusicItemInput): MusicItemFormData => ({
  title: input.title ?? '',
  artist: input.artist ?? '',
  album: input.album ?? '',
  format: input.format ?? '',
  genre: input.genre ?? '',
  releaseYear: input.releaseYear ? String(input.releaseYear) : '',
  trackCount: input.trackCount ? String(input.trackCount) : '',
  quantity: input.quantity ? String(input.quantity) : '1',
  house: input.house ?? '',
  room: input.room ?? '',
  valuation: input.valuation ? String(input.valuation) : '',
  valuationCurrency: input.valuationCurrency ?? 'USD',
  valuationDate: input.valuationDate ?? '',
  description: input.description ?? '',
  notes: input.notes ?? '',
});

const bookInputFromFormData = (
  form: BookItemFormData,
  draftId?: string | null,
): BookItemInput => ({
  id: draftId ? Number(draftId) : undefined,
  title: form.title,
  author: form.author || undefined,
  publisher: form.publisher || undefined,
  isbn: form.isbn || undefined,
  genre: form.genre || undefined,
  pageCount: parseNumber(form.pageCount),
  publicationYear: parseNumber(form.publicationYear),
  quantity: parseNumber(form.quantity),
  description: form.description || undefined,
  notes: form.notes || undefined,
  house: form.house || undefined,
  room: form.room || undefined,
  valuation: parseNumber(form.valuation),
  valuationCurrency: form.valuationCurrency || undefined,
  valuationDate: form.valuationDate || undefined,
  deleted: false,
});

const musicInputFromFormData = (
  form: MusicItemFormData,
  draftId?: string | null,
): MusicItemInput => ({
  id: draftId ? Number(draftId) : undefined,
  title: form.title,
  artist: form.artist || undefined,
  album: form.album || undefined,
  format: form.format || undefined,
  genre: form.genre || undefined,
  releaseYear: parseNumber(form.releaseYear),
  trackCount: parseNumber(form.trackCount),
  quantity: parseNumber(form.quantity),
  description: form.description || undefined,
  notes: form.notes || undefined,
  house: form.house || undefined,
  room: form.room || undefined,
  valuation: parseNumber(form.valuation),
  valuationCurrency: form.valuationCurrency || undefined,
  valuationDate: form.valuationDate || undefined,
  deleted: false,
});

const validateBookForm = (data: BookItemFormData) => {
  const errs: Record<string, string> = {};
  if (!data.title.trim()) errs.title = 'Title is required';
  return errs;
};

const validateMusicForm = (data: MusicItemFormData) => {
  const errs: Record<string, string> = {};
  if (!data.title.trim()) errs.title = 'Title is required';
  if (!data.artist.trim()) errs.artist = 'Artist is required';
  return errs;
};

const useHouseOptions = () => {
  const { houses } = useSettingsState();
  return useMemo(() => houses.filter((house) => house.visible), [houses]);
};

const UNASSIGNED_VALUE = 'unassigned';

const mapSelectValue = (value: string) =>
  value === '' ? UNASSIGNED_VALUE : value;

const normalizeSelectValue = (value: string) =>
  value === UNASSIGNED_VALUE ? '' : value;

const HouseSelect = ({
  value,
  onChange,
  houses,
}: {
  value: string;
  onChange: (next: string) => void;
  houses: ReturnType<typeof useHouseOptions>;
}) => (
  <Select
    value={mapSelectValue(value)}
    onValueChange={(next) => onChange(normalizeSelectValue(next))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select a house" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
      {houses.map((house) => (
        <SelectItem key={house.id} value={house.id}>
          {house.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const RoomSelect = ({
  value,
  onChange,
  selectedHouse,
}: {
  value: string;
  onChange: (next: string) => void;
  selectedHouse?: ReturnType<typeof useHouseOptions>[number];
}) => (
  <Select
    value={mapSelectValue(value)}
    onValueChange={(next) => onChange(normalizeSelectValue(next))}
  >
    <SelectTrigger>
      <SelectValue
        placeholder={selectedHouse ? 'Select a room' : 'Select house first'}
      />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
      {selectedHouse?.rooms.map((room) => (
        <SelectItem key={room.id} value={room.id}>
          {room.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

function BookAddItemForm() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get('draftId');
  const collection: CollectionType = 'books';
  const createItem = getCreateItemFn(collection);
  const updateItem = getUpdateItemFn(collection);
  const fetchItem = getItemFetcher(collection);
  const toInput = getItemToInputConverter(collection);
  const draftKey = draftStorageKey(collection);
  const editingKey = editingDraftKey(collection);
  const inventoryKey = inventoryStorageKeyFor(collection);
  const houses = useHouseOptions();

  const [formData, setFormData] = useState<BookItemFormData>(
    defaultBookFormData,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExistingItem, setIsExistingItem] = useState(false);

  const selectedHouse = houses.find((house) => house.id === formData.house);

  useEffect(() => {
    async function loadData() {
      if (!draftId) {
        setIsExistingItem(false);
        return;
      }

      const stored = localStorage.getItem(editingKey);
      let draft: BookItemInput | null = null;
      let existingItem: BookItem | null = null;
      let fetchAttempted = false;
      let inventoryItems: BookItem[] = [];
      if (stored) {
        try {
          draft = JSON.parse(stored) as BookItemInput;
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        try {
          inventoryItems = JSON.parse(
            localStorage.getItem(inventoryKey) || '[]',
          ) as BookItem[];
          const item = inventoryItems.find(
            (i: BookItem) => i.id === Number(draftId),
          );
          if (item) {
            draft = toInput(item) as BookItemInput;
            existingItem = item;
          }
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        const item = (await fetchItem(Number(draftId))) as BookItem | null;
        fetchAttempted = true;
        if (item) {
          draft = toInput(item) as BookItemInput;
          existingItem = item;
        }
      }

      if (draft) {
        const loaded = bookFormDataFromInput(draft);
        setFormData(loaded);
        setErrors(validateBookForm(loaded));

        let existing = false;
        if (existingItem) {
          existing = true;
        } else if (draftId) {
          const idToMatch = Number(draftId);
          const itemsToCheck = inventoryItems.length
            ? inventoryItems
            : (() => {
                try {
                  return JSON.parse(
                    localStorage.getItem(inventoryKey) || '[]',
                  ) as BookItem[];
                } catch {
                  return [] as BookItem[];
                }
              })();
          existing = itemsToCheck.some((item) => item.id === idToMatch);

          if (!existing && !fetchAttempted) {
            const fetched = (await fetchItem(Number(draftId))) as
              | BookItem
              | null;
            fetchAttempted = true;
            existing = !!fetched;
          }
        }

        setIsExistingItem(existing);
        localStorage.removeItem(editingKey);
        toast({
          title: existing ? 'Edit mode' : 'Draft loaded',
          description: existing
            ? 'Item data loaded for editing'
            : 'Your draft has been loaded successfully',
        });
      } else {
        setIsExistingItem(false);
      }
    }

    loadData();
  }, [draftId, toast, fetchItem, toInput, editingKey, inventoryKey]);

  useEffect(() => {
    if (!draftId) {
      setIsExistingItem(false);
    }
  }, [draftId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors = validateBookForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Please fix the errors',
        description: 'Some required fields are missing or invalid',
        variant: 'destructive',
      });
      return;
    }

    setErrors({});

    const input = bookInputFromFormData(formData, draftId);
    const action =
      draftId && isExistingItem
        ? updateItem(Number(draftId), input as InventoryItemInput)
        : createItem(input as InventoryItemInput);

    action
      .then(() => {
        if (draftId) {
          const drafts = JSON.parse(localStorage.getItem(draftKey) || '[]');
          const filtered = drafts.filter(
            (d: { id: number }) => d.id !== Number(draftId),
          );
          localStorage.setItem(draftKey, JSON.stringify(filtered));
        }

        toast({
          title: draftId && isExistingItem ? 'Book updated' : 'Book added',
          description:
            draftId && isExistingItem
              ? 'The book entry has been updated successfully'
              : 'The book has been added to your collection',
        });

        navigate('/inventory');
      })
      .catch((error) => {
        console.error('Error saving book item:', error);
        toast({
          title: 'Error saving book',
          description: 'There was a problem saving your changes',
          variant: 'destructive',
        });
      });
  };

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem(draftKey) || '[]');
    const id = draftId ? Number(draftId) : Date.now();
    const newDraft: DraftEntry<BookItemFormData> = {
      id,
      lastModified: new Date().toISOString().split('T')[0],
      data: formData,
      title: formData.title || 'Untitled Draft',
      category: formData.genre,
      description: formData.description || '',
      isExistingItem,
      collection,
    };
    const filtered = drafts.filter((d: { id: number }) => d.id !== id);
    localStorage.setItem(draftKey, JSON.stringify([...filtered, newDraft]));
    toast({
      title: 'Draft saved',
      description: 'You can continue editing this draft later',
    });
    navigate('/drafts');
  };

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="book-title">Title *</Label>
                <Input
                  id="book-title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="book-author">Author</Label>
                <Input
                  id="book-author"
                  value={formData.author}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, author: event.target.value }))
                  }
                  placeholder="Enter author"
                />
              </div>
              <div>
                <Label htmlFor="book-publisher">Publisher</Label>
                <Input
                  id="book-publisher"
                  value={formData.publisher}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, publisher: event.target.value }))
                  }
                  placeholder="Enter publisher"
                />
              </div>
              <div>
                <Label htmlFor="book-isbn">ISBN</Label>
                <Input
                  id="book-isbn"
                  value={formData.isbn}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, isbn: event.target.value }))
                  }
                  placeholder="Enter ISBN"
                />
              </div>
              <div>
                <Label htmlFor="book-genre">Genre</Label>
                <Input
                  id="book-genre"
                  value={formData.genre}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, genre: event.target.value }))
                  }
                  placeholder="e.g. Fiction"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="book-pages">Page Count</Label>
                  <Input
                    id="book-pages"
                    value={formData.pageCount}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        pageCount: event.target.value,
                      }))
                    }
                    placeholder="e.g. 320"
                  />
                </div>
                <div>
                  <Label htmlFor="book-year">Publication Year</Label>
                  <Input
                    id="book-year"
                    value={formData.publicationYear}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        publicationYear: event.target.value,
                      }))
                    }
                    placeholder="e.g. 1998"
                  />
                </div>
                <div>
                  <Label htmlFor="book-quantity">Quantity</Label>
                  <Input
                    id="book-quantity"
                    value={formData.quantity}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: event.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="book-valuation">Valuation</Label>
                  <Input
                    id="book-valuation"
                    value={formData.valuation}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        valuation: event.target.value,
                      }))
                    }
                    placeholder="e.g. 1250"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="book-currency">Valuation Currency</Label>
                <Input
                  id="book-currency"
                  value={formData.valuationCurrency}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      valuationCurrency: event.target.value,
                    }))
                  }
                  placeholder="e.g. USD"
                />
              </div>
              <div>
                <Label htmlFor="book-valuation-date">Valuation Date</Label>
                <Input
                  id="book-valuation-date"
                  type="date"
                  value={formData.valuationDate}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      valuationDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>House</Label>
                  <HouseSelect
                    value={formData.house}
                    houses={houses}
                    onChange={(nextHouse) =>
                      setFormData((prev) => ({
                        ...prev,
                        house: nextHouse,
                        room:
                          nextHouse && nextHouse === prev.house ? prev.room : '',
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Room</Label>
                  <RoomSelect
                    value={formData.room}
                    selectedHouse={selectedHouse}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, room: value }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="book-description">Description</Label>
            <Textarea
              id="book-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Add a description"
            />
          </div>

          <div>
            <Label htmlFor="book-notes">Notes</Label>
            <Textarea
              id="book-notes"
              value={formData.notes}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Additional notes"
            />
          </div>

          <div className="flex gap-4 pt-4 max-w-xl">
            <Button type="submit" className="flex-1">
              {draftId && isExistingItem ? 'Save Changes' : 'Add Book'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function MusicAddItemForm() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get('draftId');
  const collection: CollectionType = 'music';
  const createItem = getCreateItemFn(collection);
  const updateItem = getUpdateItemFn(collection);
  const fetchItem = getItemFetcher(collection);
  const toInput = getItemToInputConverter(collection);
  const draftKey = draftStorageKey(collection);
  const editingKey = editingDraftKey(collection);
  const inventoryKey = inventoryStorageKeyFor(collection);
  const houses = useHouseOptions();

  const [formData, setFormData] = useState<MusicItemFormData>(
    defaultMusicFormData,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExistingItem, setIsExistingItem] = useState(false);

  const selectedHouse = houses.find((house) => house.id === formData.house);

  useEffect(() => {
    async function loadData() {
      if (!draftId) {
        setIsExistingItem(false);
        return;
      }

      const stored = localStorage.getItem(editingKey);
      let draft: MusicItemInput | null = null;
      let existingItem: MusicItem | null = null;
      let fetchAttempted = false;
      let inventoryItems: MusicItem[] = [];
      if (stored) {
        try {
          draft = JSON.parse(stored) as MusicItemInput;
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        try {
          inventoryItems = JSON.parse(
            localStorage.getItem(inventoryKey) || '[]',
          ) as MusicItem[];
          const item = inventoryItems.find(
            (i: MusicItem) => i.id === Number(draftId),
          );
          if (item) {
            draft = toInput(item) as MusicItemInput;
            existingItem = item;
          }
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        const item = (await fetchItem(Number(draftId))) as MusicItem | null;
        fetchAttempted = true;
        if (item) {
          draft = toInput(item) as MusicItemInput;
          existingItem = item;
        }
      }

      if (draft) {
        const loaded = musicFormDataFromInput(draft);
        setFormData(loaded);
        setErrors(validateMusicForm(loaded));

        let existing = false;
        if (existingItem) {
          existing = true;
        } else if (draftId) {
          const idToMatch = Number(draftId);
          const itemsToCheck = inventoryItems.length
            ? inventoryItems
            : (() => {
                try {
                  return JSON.parse(
                    localStorage.getItem(inventoryKey) || '[]',
                  ) as MusicItem[];
                } catch {
                  return [] as MusicItem[];
                }
              })();
          existing = itemsToCheck.some((item) => item.id === idToMatch);

          if (!existing && !fetchAttempted) {
            const fetched = (await fetchItem(Number(draftId))) as
              | MusicItem
              | null;
            fetchAttempted = true;
            existing = !!fetched;
          }
        }

        setIsExistingItem(existing);
        localStorage.removeItem(editingKey);
        toast({
          title: existing ? 'Edit mode' : 'Draft loaded',
          description: existing
            ? 'Item data loaded for editing'
            : 'Your draft has been loaded successfully',
        });
      } else {
        setIsExistingItem(false);
      }
    }

    loadData();
  }, [draftId, toast, fetchItem, toInput, editingKey, inventoryKey]);

  useEffect(() => {
    if (!draftId) {
      setIsExistingItem(false);
    }
  }, [draftId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors = validateMusicForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Please fix the errors',
        description: 'Some required fields are missing or invalid',
        variant: 'destructive',
      });
      return;
    }

    setErrors({});

    const input = musicInputFromFormData(formData, draftId);
    const action =
      draftId && isExistingItem
        ? updateItem(Number(draftId), input as InventoryItemInput)
        : createItem(input as InventoryItemInput);

    action
      .then(() => {
        if (draftId) {
          const drafts = JSON.parse(localStorage.getItem(draftKey) || '[]');
          const filtered = drafts.filter(
            (d: { id: number }) => d.id !== Number(draftId),
          );
          localStorage.setItem(draftKey, JSON.stringify(filtered));
        }

        toast({
          title: draftId && isExistingItem ? 'Music item updated' : 'Music item added',
          description:
            draftId && isExistingItem
              ? 'The recording has been updated successfully'
              : 'The music item has been added to your collection',
        });

        navigate('/inventory');
      })
      .catch((error) => {
        console.error('Error saving music item:', error);
        toast({
          title: 'Error saving music item',
          description: 'There was a problem saving your changes',
          variant: 'destructive',
        });
      });
  };

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem(draftKey) || '[]');
    const id = draftId ? Number(draftId) : Date.now();
    const newDraft: DraftEntry<MusicItemFormData> = {
      id,
      lastModified: new Date().toISOString().split('T')[0],
      data: formData,
      title: formData.title || 'Untitled Draft',
      category: formData.genre,
      description: formData.description || '',
      isExistingItem,
      collection,
    };
    const filtered = drafts.filter((d: { id: number }) => d.id !== id);
    localStorage.setItem(draftKey, JSON.stringify([...filtered, newDraft]));
    toast({
      title: 'Draft saved',
      description: 'You can continue editing this draft later',
    });
    navigate('/drafts');
  };

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="music-title">Title *</Label>
                <Input
                  id="music-title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="music-artist">Artist *</Label>
                <Input
                  id="music-artist"
                  value={formData.artist}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, artist: event.target.value }))
                  }
                  placeholder="Enter artist"
                />
                {errors.artist && (
                  <p className="text-sm text-destructive mt-1">{errors.artist}</p>
                )}
              </div>
              <div>
                <Label htmlFor="music-album">Album</Label>
                <Input
                  id="music-album"
                  value={formData.album}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, album: event.target.value }))
                  }
                  placeholder="Album name"
                />
              </div>
              <div>
                <Label htmlFor="music-format">Format</Label>
                <Input
                  id="music-format"
                  value={formData.format}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, format: event.target.value }))
                  }
                  placeholder="e.g. Vinyl"
                />
              </div>
              <div>
                <Label htmlFor="music-genre">Genre</Label>
                <Input
                  id="music-genre"
                  value={formData.genre}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, genre: event.target.value }))
                  }
                  placeholder="e.g. Jazz"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="music-year">Release Year</Label>
                  <Input
                    id="music-year"
                    value={formData.releaseYear}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        releaseYear: event.target.value,
                      }))
                    }
                    placeholder="e.g. 1978"
                  />
                </div>
                <div>
                  <Label htmlFor="music-tracks">Track Count</Label>
                  <Input
                    id="music-tracks"
                    value={formData.trackCount}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        trackCount: event.target.value,
                      }))
                    }
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <Label htmlFor="music-quantity">Quantity</Label>
                  <Input
                    id="music-quantity"
                    value={formData.quantity}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: event.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="music-valuation">Valuation</Label>
                  <Input
                    id="music-valuation"
                    value={formData.valuation}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        valuation: event.target.value,
                      }))
                    }
                    placeholder="e.g. 600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="music-currency">Valuation Currency</Label>
                <Input
                  id="music-currency"
                  value={formData.valuationCurrency}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      valuationCurrency: event.target.value,
                    }))
                  }
                  placeholder="e.g. USD"
                />
              </div>
              <div>
                <Label htmlFor="music-valuation-date">Valuation Date</Label>
                <Input
                  id="music-valuation-date"
                  type="date"
                  value={formData.valuationDate}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      valuationDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>House</Label>
                  <HouseSelect
                    value={formData.house}
                    houses={houses}
                    onChange={(nextHouse) =>
                      setFormData((prev) => ({
                        ...prev,
                        house: nextHouse,
                        room:
                          nextHouse && nextHouse === prev.house ? prev.room : '',
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Room</Label>
                  <RoomSelect
                    value={formData.room}
                    selectedHouse={selectedHouse}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, room: value }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="music-description">Description</Label>
            <Textarea
              id="music-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Add a description"
            />
          </div>

          <div>
            <Label htmlFor="music-notes">Notes</Label>
            <Textarea
              id="music-notes"
              value={formData.notes}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Additional notes"
            />
          </div>

          <div className="flex gap-4 pt-4 max-w-xl">
            <Button type="submit" className="flex-1">
              {draftId && isExistingItem ? 'Save Changes' : 'Add Music Item'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function AddItemForm() {
  const { collection } = useCollection();

  if (collection === 'books') {
    return <BookAddItemForm />;
  }

  if (collection === 'music') {
    return <MusicAddItemForm />;
  }

  return <ArtAddItemForm />;
}

