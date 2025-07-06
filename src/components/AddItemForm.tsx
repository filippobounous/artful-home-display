
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddItemBasicInfo } from "./AddItemBasicInfo";
import { AddItemLocationValuation } from "./AddItemLocationValuation";
import { AddItemImages } from "./AddItemImages";
import { AddItemDescriptionNotes } from "./AddItemDescriptionNotes";
import { useToast } from "@/hooks/use-toast";

export function AddItemForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const draftId = searchParams.get('draftId');

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    category: "",
    subcategory: "",
    size: "",
    valuation: "",
    valuationDate: undefined as Date | undefined,
    valuationPerson: "",
    valuationCurrency: "USD",
    quantity: "1",
    yearPeriod: "",
    house: "",
    room: "",
    description: "",
    condition: "",
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
            title: draft.title || "",
            artist: draft.artist || "",
            category: draft.category || "",
            subcategory: draft.subcategory || "",
            size: draft.size || "",
            valuation: draft.valuation || "",
            valuationDate: draft.valuationDate || undefined,
            valuationPerson: draft.valuationPerson || "",
            valuationCurrency: draft.valuationCurrency || "USD",
            quantity: draft.quantity || "1",
            yearPeriod: draft.yearPeriod || "",
            house: draft.house || "",
            room: draft.room || "",
            description: draft.description || "",
            condition: draft.condition || "",
            notes: draft.notes || "",
            images: draft.images || []
          });
          
          // Clear the draft data from localStorage
          localStorage.removeItem('editingDraft');
          
          toast({
            title: "Draft loaded",
            description: "Your draft has been loaded successfully"
          });
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

    toast({
      title: draftId ? "Item updated" : "Item added",
      description: draftId
        ? "Your item has been updated successfully"
        : "Your item has been added to the collection successfully"
    });

    // Navigate back to all items or appropriate page
    navigate('/all-items');
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
            <Button type="button" variant="outline" className="flex-1 h-12 text-lg font-semibold">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
