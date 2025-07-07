
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { useSettingsState } from "@/hooks/useSettingsState";
import type { CheckboxCheckedState } from "@radix-ui/react-checkbox";

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

  // Create combined options with headers as tri-state checkboxes
  const combinedOptions = categories.flatMap(category => {
    const subcategoryIds = category.subcategories.map(sub => sub.id);
    const selectedSubs = selectedSubcategory.filter(id => subcategoryIds.includes(id));
    const allSelected = selectedSubs.length === subcategoryIds.length && subcategoryIds.length > 0;
    const checkState: CheckboxCheckedState =
      selectedCategory.includes(category.id) || allSelected
        ? true
        : selectedSubs.length > 0
          ? "indeterminate"
          : false;
    return [
      {
        id: category.id,
        name: category.name,
        header: true,
        checkState,
        onCheckChange: (checked: CheckboxCheckedState) => {
          if (!permanentCategory) {
            if (checked) {
              if (!selectedCategory.includes(category.id)) {
                setSelectedCategory([...selectedCategory, category.id]);
              }
              setSelectedSubcategory(selectedSubcategory.filter(s => !subcategoryIds.includes(s)));
            } else {
              setSelectedCategory(selectedCategory.filter(c => c !== category.id));
              setSelectedSubcategory(selectedSubcategory.filter(s => !subcategoryIds.includes(s)));
            }
          }
        }
      },
      ...category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        indent: true
      }))
    ];
  });

  // Combine selected values for display
  const allSelectedValues = [...selectedCategory, ...selectedSubcategory];
  
  const handleSelectionChange = (values: string[]) => {
    const categoryIds: string[] = [];
    const subcategoryIds: string[] = [];

    categories.forEach(category => {
      const subIds = category.subcategories.map(s => s.id);
      const selectedSubs = values.filter(v => subIds.includes(v));
      const hasCategory = values.includes(category.id);
      if (hasCategory || (selectedSubs.length === subIds.length && subIds.length > 0)) {
        categoryIds.push(category.id);
      } else {
        subcategoryIds.push(...selectedSubs);
      }
    });

    if (!permanentCategory) {
      setSelectedCategory(categoryIds);
    }
    setSelectedSubcategory(subcategoryIds);
  };

  if (permanentCategory) {
    // Only show subcategory filter for permanent category pages
    const permanentCat = categories.find(cat => cat.id === permanentCategory);
    if (!permanentCat) return null;
    
    const subcategoryOptions = permanentCat.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name
    }));

    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Subcategories</label>
        <MultiSelectFilter
          placeholder="Select subcategories"
          options={subcategoryOptions}
          selectedValues={selectedSubcategory}
          onSelectionChange={setSelectedSubcategory}
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">Categories & Subcategories</label>
      <MultiSelectFilter
        placeholder="Select categories or subcategories"
        options={combinedOptions}
        selectedValues={allSelectedValues}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
