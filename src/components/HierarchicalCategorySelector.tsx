import { createHierarchicalSettingsSelector } from '@/components/createHierarchicalSettingsSelector';
import type {
  CategoryConfig,
  SubcategoryConfig,
} from '@/types/inventory';

interface HierarchicalCategorySelectorProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectionChange: (category: string, subcategory: string) => void;
  invalid?: boolean;
}

const CategorySelector = createHierarchicalSettingsSelector<
  CategoryConfig,
  SubcategoryConfig
>({
  label: 'Category *',
  labelFor: 'categorySubcategory',
  placeholder: 'Select category and subcategory',
  selectParents: (state) => state.categories,
  getChildren: (category) => category.subcategories,
  includeGeneralOption: true,
  isParentVisible: (category) => Boolean(category.visible),
  isChildVisible: (subcategory) => Boolean(subcategory.visible),
});

export function HierarchicalCategorySelector({
  selectedCategory,
  selectedSubcategory,
  onSelectionChange,
  invalid = false,
}: HierarchicalCategorySelectorProps) {
  return (
    <CategorySelector
      selectedParent={selectedCategory}
      selectedChild={selectedSubcategory}
      onSelectionChange={onSelectionChange}
      invalid={invalid}
    />
  );
}
