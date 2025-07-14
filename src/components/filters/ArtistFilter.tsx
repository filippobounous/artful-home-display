import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';

interface ArtistFilterProps {
  artistOptions: string[];
  selectedArtist: string[];
  setSelectedArtist: (artists: string[]) => void;
}

export function ArtistFilter({
  artistOptions,
  selectedArtist,
  setSelectedArtist,
}: ArtistFilterProps) {
  const options = artistOptions.map((a) => ({ id: a, name: a }));
  return (
    <div>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        Artist
      </Label>
      <MultiSelectFilter
        placeholder="Select artists"
        options={options}
        selectedValues={selectedArtist}
        onSelectionChange={setSelectedArtist}
      />
    </div>
  );
}
