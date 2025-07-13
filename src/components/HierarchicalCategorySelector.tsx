import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useSettingsState } from '@/hooks/useSettingsState';

interface HierarchicalCategorySelectorProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectionChange: (category: string, subcategory: string) => void;
  invalid?: boolean;
}

export function HierarchicalCategorySelector({
  selectedCategory,
  selectedSubcategory,
  onSelectionChange,
  invalid = false,
}: HierarchicalCategorySelectorProps) {
  const { categories } = useSettingsState();

  const currentValue = selectedCategory
    ? `${selectedCategory}|${selectedSubcategory || ''}`
    : '';

  const handleSelectionChange = (value: string) => {
    if (value) {
      const [categoryId, subcategoryId] = value.split('|');
      onSelectionChange(categoryId, subcategoryId || '');
    } else {
      onSelectionChange('', '');
    }
  };

  return (
    <div>
      <Label htmlFor="categorySubcategory">Category *</Label>
      <Select value={currentValue} onValueChange={handleSelectionChange}>
        <SelectTrigger
          className={cn(
            currentValue ? undefined : 'text-muted-foreground',
            invalid && 'border-destructive focus:ring-destructive',
          )}
        >
          <SelectValue placeholder="Select category and subcategory" />
        </SelectTrigger>
        <SelectContent>
          {categories
            .filter((c) => c.visible)
            .map((category) => (
              <div key={category.id}>
                <div className="px-2 py-1 text-sm font-medium text-slate-600 bg-muted">
                  {category.name}
                </div>
                <SelectItem
                  value={`${category.id}|`}
                  className="pl-6 font-medium"
                >
                  General {category.name}
                </SelectItem>
                {category.subcategories
                  .filter((s) => s.visible)
                  .map((subcategory) => (
                    <SelectItem
                      key={`${category.id}|${subcategory.id}`}
                      value={`${category.id}|${subcategory.id}`}
                      className="pl-6"
                    >
                      {subcategory.name}
                    </SelectItem>
                  ))}
              </div>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
