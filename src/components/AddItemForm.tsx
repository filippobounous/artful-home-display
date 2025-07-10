
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddItemBasicInfo } from "./AddItemBasicInfo";
import { AddItemLocationValuation } from "./AddItemLocationValuation";
import { AddItemImages } from "./AddItemImages";
import { AddItemDescriptionNotes } from "./AddItemDescriptionNotes";
import { useToast } from "@/hooks/use-toast";
import { createDecorItem, updateDecorItem } from "@/lib/api";
import type { DecorItem } from "@/types/inventory";

export function AddItemForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const draftId = searchParams.get('draftId');

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    creator: "",
    originRegion: "",
    datePeriod: "",
    material: "",
    widthCm: "",
    heightCm: "",
    depthCm: "",
    weightKg: "",
    provenance: "",
    category: "",
    subcategory: "",
    quantity: "1",
    house: "",
    room_code: "",
    acquisitionValue: "",
    acquisitionDate: undefined as Date | undefined,
    acquisitionCurrency: "USD",
    appraisalValue: "",
    appraisalDate: undefined as Date | undefined,
    appraisalCurrency: "USD",
    appraisalEntity: "",
    description: "",
    notes: "",
    images: [] as string[]
  });

  useEffect(() => {
    if (draftId) {
      const draftData = localStorage.getItem('editingDraft');
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          setFormData({
            code: draft.code || "",
            name: draft.name || draft.title || "",
            creator: draft.creator || draft.artist || "",
            originRegion: draft.originRegion || draft.origin_region || "",
            datePeriod: draft.datePeriod || draft.yearPeriod || "",
            material: draft.material || "",
            widthCm: draft.widthCm || "",
            heightCm: draft.heightCm || "",
            depthCm: draft.depthCm || "",
            weightKg: draft.weightKg || draft.weight_kg || "",
            provenance: draft.provenance || "",
            category: draft.category || "",
            subcategory: draft.subcategory || "",
            quantity: draft.quantity || "1",
            house: draft.house || "",
            room_code: draft.room_code || draft.room || "",
            acquisitionValue: draft.acquisitionValue || draft.acquisition_value || "",
            acquisitionDate: draft.acquisitionDate || draft.acquisition_date || undefined,
            acquisitionCurrency: draft.acquisitionCurrency || draft.acquisition_currency || "USD",
            appraisalValue: draft.appraisalValue || draft.appraisal_value || draft.valuation || "",
            appraisalDate: draft.appraisalDate || draft.appraisal_date || draft.valuationDate || undefined,
            appraisalCurrency: draft.appraisalCurrency || draft.appraisal_currency || draft.valuationCurrency || "USD",
            appraisalEntity: draft.appraisalEntity || draft.appraisal_entity || draft.valuationPerson || "",
            description: draft.description || "",
            notes: draft.notes || "",
            images: draft.images || []
          });
          
          // Clear the draft data from localStorage
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
        } catch (error) {
          console.error('Error loading draft:', error);
          toast({
            title: "Error loading draft",
            description: "Failed to load the draft data",
            variant: "destructive"
          });
        }
      }
    }
  }, [draftId, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const required = [
      formData.name,
      formData.room_code,
      formData.creator,
      formData.originRegion,
      formData.datePeriod,
      formData.category,
      formData.subcategory,
      formData.quantity,
    ];

    if (required.some((v) => !v || v === "")) {
      toast({
        title: "Missing required fields",
        description: "Please fill all mandatory fields before submitting",
        variant: "destructive",
      });
      return;
    }

    const acqProvided =
      formData.acquisitionDate || formData.acquisitionValue || formData.acquisitionCurrency;
    if (acqProvided && !(formData.acquisitionDate && formData.acquisitionValue && formData.acquisitionCurrency)) {
      toast({
        title: "Incomplete acquisition info",
        description: "Date, value and currency must all be provided",
        variant: "destructive",
      });
      return;
    }

    const apprProvided =
      formData.appraisalDate ||
      formData.appraisalValue ||
      formData.appraisalCurrency ||
      formData.appraisalEntity;
    if (apprProvided && !(formData.appraisalDate && formData.appraisalValue && formData.appraisalCurrency && formData.appraisalEntity)) {
      toast({
        title: "Incomplete appraisal info",
        description: "Date, value, currency and entity must all be provided",
        variant: "destructive",
      });
      return;
    }

    // Create a proper DecorItem object
    const decorItem: DecorItem = {
      id: draftId ? Number(draftId) : 0,
      code: formData.code || undefined,
      name: formData.name,
      title: formData.name,
      creator: formData.creator,
      artist: formData.creator,
      origin_region: formData.originRegion,
      date_period: formData.datePeriod,
      yearPeriod: formData.datePeriod,
      material: formData.material,
      widthCm: formData.widthCm ? Number(formData.widthCm) : undefined,
      heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
      depthCm: formData.depthCm ? Number(formData.depthCm) : undefined,
      weight_kg: formData.weightKg ? Number(formData.weightKg) : undefined,
      provenance: formData.provenance,
      category: formData.category,
      subcategory: formData.subcategory,
      quantity: formData.quantity ? Number(formData.quantity) : 1,
      acquisition_value: formData.acquisitionValue ? Number(formData.acquisitionValue) : undefined,
      acquisition_date: formData.acquisitionDate ? formData.acquisitionDate.toISOString().split('T')[0] : undefined,
      acquisition_currency: formData.acquisitionCurrency || undefined,
      appraisal_value: formData.appraisalValue ? Number(formData.appraisalValue) : undefined,
      appraisal_date: formData.appraisalDate ? formData.appraisalDate.toISOString().split('T')[0] : undefined,
      appraisal_currency: formData.appraisalCurrency || undefined,
      appraisal_entity: formData.appraisalEntity || undefined,
      valuation: formData.appraisalValue ? Number(formData.appraisalValue) : undefined,
      valuationDate: formData.appraisalDate ? formData.appraisalDate.toISOString().split('T')[0] : undefined,
      valuationCurrency: formData.appraisalCurrency,
      valuationPerson: formData.appraisalEntity,
      house: formData.house,
      room_code: formData.room_code,
      room: formData.room_code,
      description: formData.description,
      notes: formData.notes,
      image: formData.images[0] || "/placeholder.svg",
      images: formData.images,
      condition: "good" as const, // Default condition
      version: 1,
      is_deleted: false,
      deleted: false,
    };

    let saveAction: Promise<DecorItem | null>;
    let exists = false;

    if (draftId) {
      const inventory = JSON.parse(
        localStorage.getItem('inventoryData') || '[]'
      ) as DecorItem[];
      exists = inventory.some((item) => item.id === Number(draftId) && !item.deleted);

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
          const filtered = drafts.filter((d: { id: number }) => d.id !== Number(draftId));
          localStorage.setItem('drafts', JSON.stringify(filtered));
        }

        toast({
          title: draftId && exists ? 'Item updated' : 'Item added',
          description: draftId && exists
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
          variant: 'destructive'
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
              <AddItemBasicInfo formData={formData} setFormData={setFormData} />
            </div>

            {/* Category, Location and Valuation - Right Column */}
            <div className="h-full">
              <AddItemLocationValuation formData={formData} setFormData={setFormData} />
            </div>
          </div>

          {/* Description and Notes */}
          <AddItemDescriptionNotes formData={formData} setFormData={setFormData} />

          {/* Images */}
          <AddItemImages formData={formData} setFormData={setFormData} />

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
