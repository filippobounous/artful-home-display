import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categoryConfigs } from '@/types/inventory';

interface CombinedCategorySelectorProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectionChange: (category: string, subcategory: string) => void;
}

export function CombinedCategorySelector({
  selectedCategory,
  selectedSubcategory,
  onSelectionChange,
}: CombinedCategorySelectorProps) {
  // Create combined options
  const combinedOptions = categoryConfigs.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: `${category.id}|${subcategory.id}`,
      label: `${category.name} - ${subcategory.name}`,
      categoryId: category.id,
      subcategoryId: subcategory.id,
    })),
  );

  // Also add category-only options
  const categoryOnlyOptions = categoryConfigs.map((category) => ({
    value: `${category.id}|`,
    label: `${category.name} (General)`,
    categoryId: category.id,
    subcategoryId: '',
  }));

  const allOptions = [...categoryOnlyOptions, ...combinedOptions];

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
          className={currentValue ? undefined : 'text-muted-foreground'}
        >
          <SelectValue placeholder="Select category and subcategory" />
        </SelectTrigger>
        <SelectContent>
          {allOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
