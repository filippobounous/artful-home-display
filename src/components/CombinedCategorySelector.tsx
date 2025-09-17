import { CombinedParentChildSelect } from '@/components/CombinedParentChildSelect';
import { useSettingsState } from '@/hooks/useSettingsState';

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
  const { categories } = useSettingsState();

  return (
    <CombinedParentChildSelect
      selectId="categorySubcategory"
      label="Category *"
      placeholder="Select category and subcategory"
      items={categories}
      selectedParentId={selectedCategory}
      selectedChildId={selectedSubcategory}
      getParentId={(category) => category.id}
      getChildren={(category) => category.subcategories}
      getChildId={(subcategory) => subcategory.id}
      buildOptionLabel={(category, subcategory) =>
        `${category.name} - ${subcategory.name}`
      }
      buildParentOnlyLabel={(category) => `${category.name} (General)`}
      includeParentOnlyOption
      buildValue={(categoryId, subcategoryId) =>
        `${categoryId}|${subcategoryId}`
      }
      parseValue={(value) => {
        const [categoryId, subcategoryId = ''] = value.split('|');
        return { parentId: categoryId, childId: subcategoryId };
      }}
      buildCurrentValue={(categoryId, subcategoryId) =>
        categoryId ? `${categoryId}|${subcategoryId || ''}` : ''
      }
      onSelectionChange={onSelectionChange}
    />
  );
}
