
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
    origin_region: "",
    material: "",
    width_cm: "",
    height_cm: "",
    depth_cm: "",
    weight_kg: "",
    provenance: "",
    category: "",
    subcategory: "",
    acquisition_value: "",
    acquisition_date: undefined as Date | undefined,
    acquisition_currency: "EUR",
    appraisal_value: "",
    appraisal_date: undefined as Date | undefined,
    appraisal_currency: "EUR",
    appraisal_entity: "",
    quantity: "1",
    date_period: "",
    house: "",
    room: "",
    room_code: "",
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
            name: draft.name || "",
            creator: draft.creator || "",
            origin_region: draft.origin_region || "",
            material: draft.material || "",
            width_cm: draft.width_cm || "",
            height_cm: draft.height_cm || "",
            depth_cm: draft.depth_cm || "",
            weight_kg: draft.weight_kg || "",
            provenance: draft.provenance || "",
            category: draft.category || "",
            subcategory: draft.subcategory || "",
            acquisition_value: draft.acquisition_value || "",
            acquisition_date: draft.acquisition_date || undefined,
            acquisition_currency: draft.acquisition_currency || "EUR",
            appraisal_value: draft.appraisal_value || "",
            appraisal_date: draft.appraisal_date || undefined,
            appraisal_currency: draft.appraisal_currency || "EUR",
            appraisal_entity: draft.appraisal_entity || "",
            quantity: draft.quantity || "1",
            date_period: draft.date_period || "",
            house: draft.house || "",
            room: draft.room || "",
            room_code: draft.room_code || "",
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

    const requiredFields = [
      'name',
      'room_code',
      'creator',
      'origin_region',
      'date_period',
      'category',
      'subcategory',
      'quantity'
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: 'Missing information',
          description: `Field "${field}" is required`,
          variant: 'destructive'
        });
        return;
      }
    }

    const hasAcq =
      formData.acquisition_date || formData.acquisition_value || formData.acquisition_currency;
    if (hasAcq && (!formData.acquisition_date || !formData.acquisition_value || !formData.acquisition_currency)) {
      toast({
        title: 'Invalid acquisition data',
        description: 'Acquisition date, value and currency must all be provided',
        variant: 'destructive'
      });
      return;
    }

    const hasApp =
      formData.appraisal_date || formData.appraisal_value || formData.appraisal_currency || formData.appraisal_entity;
    if (hasApp && (!formData.appraisal_date || !formData.appraisal_value || !formData.appraisal_currency || !formData.appraisal_entity)) {
      toast({
        title: 'Invalid appraisal data',
        description: 'Appraisal date, value, currency and entity must all be provided',
        variant: 'destructive'
      });
      return;
    }

    const itemData = { ...formData } as unknown as DecorItem;
    let saveAction: Promise<DecorItem | null>;
    let exists = false;

    if (draftId) {
      const inventory = JSON.parse(
        localStorage.getItem('inventoryData') || '[]'
      ) as DecorItem[];
      exists = inventory.some((item) => item.id === Number(draftId) && !item.deleted);

      saveAction = exists
        ? updateDecorItem(draftId, { id: Number(draftId), ...itemData })
        : createDecorItem(itemData);
    } else {
      saveAction = createDecorItem(itemData);
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
