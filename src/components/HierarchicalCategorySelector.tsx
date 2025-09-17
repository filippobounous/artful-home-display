import { HierarchicalSelector } from '@/components/HierarchicalSelector';
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

  return (
    <HierarchicalSelector
      label="Category *"
      labelFor="categorySubcategory"
      placeholder="Select category and subcategory"
      parents={categories}
      selectedParent={selectedCategory}
      selectedChild={selectedSubcategory}
      onSelectionChange={onSelectionChange}
      getChildren={(category) => category.subcategories}
      getParentId={(category) => category.id}
      getParentName={(category) => category.name}
      getChildId={(subcategory) => subcategory.id}
      getChildName={(subcategory) => subcategory.name}
      invalid={invalid}
      includeGeneralOption
      isParentVisible={(category) => Boolean(category.visible)}
      isChildVisible={(subcategory) => Boolean(subcategory.visible)}
    />
  );
}
