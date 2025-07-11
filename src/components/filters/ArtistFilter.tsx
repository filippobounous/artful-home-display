import { MultiSelectFilter } from "@/components/MultiSelectFilter";

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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Artist
      </label>
      <MultiSelectFilter
        placeholder="Select artists"
        options={options}
        selectedValues={selectedArtist}
        onSelectionChange={setSelectedArtist}
      />
    </div>
  );
}
