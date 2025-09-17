import { HierarchicalMultiSelectFilter } from './HierarchicalMultiSelectFilter';
import { useSettingsState } from '@/hooks/useSettingsState';

interface CombinedCategoryFilterProps {
  selectedCategory: string[];
  setSelectedCategory: (categories: string[]) => void;
  selectedSubcategory: string[];
  setSelectedSubcategory: (subcategories: string[]) => void;
  permanentCategory?: string;
}

export function CombinedCategoryFilter({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  permanentCategory,
}: CombinedCategoryFilterProps) {
  const { categories } = useSettingsState();

  return (
    <HierarchicalMultiSelectFilter
      parents={categories}
      getParentId={(category) => category.id}
      getParentName={(category) => category.name}
      getParentVisible={(category) => category.visible}
      getChildren={(category) => category.subcategories}
      getChildId={(_, subcategory) => subcategory.id}
      getChildName={(_, subcategory) => subcategory.name}
      isChildVisible={(_, subcategory) => subcategory.visible}
      selectedParentIds={selectedCategory}
      setSelectedParentIds={setSelectedCategory}
      selectedChildIds={selectedSubcategory}
      setSelectedChildIds={setSelectedSubcategory}
      permanentParentId={permanentCategory}
      label="Categories & Subcategories"
      placeholder="Select categories or subcategories"
      childOnlyLabel="Subcategories"
      childOnlyPlaceholder="Select subcategories"
    />
  );
}
