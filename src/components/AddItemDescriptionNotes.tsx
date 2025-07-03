
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddItemDescriptionNotesProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

export function AddItemDescriptionNotes({ formData, setFormData }: AddItemDescriptionNotesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>
    </div>
  );
}
