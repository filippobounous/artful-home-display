import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddItemDescriptionNotesProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

export function AddItemDescriptionNotes({
  formData,
  setFormData,
}: AddItemDescriptionNotesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">
        Description &amp; Notes
      </h3>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Detailed description of the item"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
        />
      </div>
    </div>
  );
}
