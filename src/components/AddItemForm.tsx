
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddItemBasicInfo } from './AddItemBasicInfo';
import { AddItemLocationValuation } from './AddItemLocationValuation';
import { AddItemDescriptionNotes } from './AddItemDescriptionNotes';
import { AddItemImages } from './AddItemImages';
import { useToast } from '@/hooks/use-toast';
import {
  createDecorItem,
  updateDecorItem,
  fetchDecorItem,
  decorItemToInput,
} from '@/lib/api';
import type { DecorItem, DecorItemInput } from '@/types/inventory';
import type { DecorItemFormData } from '@/types/forms';

function validateRequiredFields(data: DecorItemFormData) {
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

export function AddItemForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const draftId = searchParams.get('draftId');

  const [formData, setFormData] = useState<DecorItemFormData & { images: string[] }>({
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
    acquisition_date: undefined as Date | undefined,
    acquisition_value: '',
    acquisition_currency: 'EUR',
    appraisal_date: undefined as Date | undefined,
    appraisal_value: '',
    appraisal_currency: 'EUR',
    appraisal_entity: '',
    description: '',
    notes: '',
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      if (!draftId) return;
      const stored = localStorage.getItem('editingDraft');
      let draft: DecorItemInput | null = null;
      if (stored) {
        try {
          draft = JSON.parse(stored);
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        try {
          const inventory = JSON.parse(
            localStorage.getItem('inventoryData') || '[]',
          );
          const item = inventory.find(
            (i: DecorItem) => i.id === Number(draftId),
          );
          if (item) draft = decorItemToInput(item);
        } catch {
          draft = null;
        }
      }

      if (!draft) {
        const item = await fetchDecorItem(draftId);
        if (item) draft = decorItemToInput(item);
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
          acquisition_value: draft.acquisition_value ? String(draft.acquisition_value) : '',
          acquisition_currency: draft.acquisition_currency || 'EUR',
          appraisal_date: appraisalDate,
          appraisal_value: draft.appraisal_value ? String(draft.appraisal_value) : '',
          appraisal_currency: draft.appraisal_currency || 'EUR',
          appraisal_entity: draft.appraisal_entity || '',
          description: draft.description || '',
          notes: draft.notes || '',
          images: [],
        };

        setFormData(loaded);
        setErrors(validateRequiredFields(loaded));

        localStorage.removeItem('editingDraft');

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
      }
    }
    loadData();
  }, [draftId, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateRequiredFields(formData);

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
        ? formData.acquisition_date.toISOString().split('T')[0]
        : undefined,
      acquisition_value: formData.acquisition_value
        ? Number(formData.acquisition_value)
        : undefined,
      acquisition_currency: formData.acquisition_currency || undefined,
      appraisal_date: formData.appraisal_date
        ? formData.appraisal_date.toISOString().split('T')[0]
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

    let saveAction: Promise<DecorItem>;
    let exists = false;

    if (draftId) {
      const inventory = JSON.parse(
        localStorage.getItem('inventoryData') || '[]',
      ) as DecorItem[];
      exists = inventory.some(
        (item) => item.id === Number(draftId) && !item.deleted,
      );

      saveAction = exists
        ? updateDecorItem(draftId, decorItem)
        : createDecorItem(decorItem);
    } else {
      saveAction = createDecorItem(decorItem);
    }

    saveAction
      .then(() => {
        if (draftId) {
          const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
          const filtered = drafts.filter(
            (d: { id: number }) => d.id !== Number(draftId),
          );
          localStorage.setItem('drafts', JSON.stringify(filtered));
        }

        toast({
          title: draftId && exists ? 'Item updated' : 'Item added',
          description:
            draftId && exists
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
    const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
    const id = draftId ? Number(draftId) : Date.now();
    const newDraft = {
      id,
      lastModified: new Date().toISOString().split('T')[0],
      data: formData,
      title: formData.name || 'Untitled Draft',
      category: formData.category,
      description: formData.description || '',
    };
    const filtered = drafts.filter((d: { id: number }) => d.id !== id);
    localStorage.setItem('drafts', JSON.stringify([...filtered, newDraft]));
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
            {/* Basic Information - Left Column */}
            <div className="h-full">
              <AddItemBasicInfo
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>

            {/* Category, Location and Valuation - Right Column */}
            <div className="h-full">
              <AddItemLocationValuation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          </div>

          {/* Images Section */}
          <AddItemImages
            formData={formData}
            setFormData={setFormData}
          />

          {/* Description and Notes */}
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
