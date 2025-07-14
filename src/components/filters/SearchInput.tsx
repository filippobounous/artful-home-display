import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function SearchInput({ searchTerm, setSearchTerm }: SearchInputProps) {
  return (
    <div className="md:col-span-2">
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        Search Collection
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search titles, descriptions, artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
