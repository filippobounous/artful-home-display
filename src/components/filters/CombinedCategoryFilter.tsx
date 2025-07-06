
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { useSettingsState } from "@/hooks/useSettingsState";

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

  // Create combined options with headers similar to the Add Item form
  const combinedOptions = categories.flatMap(category => [
    { id: `header-${category.id}`, name: category.name, header: true },
    { id: category.id, name: `General ${category.name}`, indent: true },
    ...category.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      indent: true
    }))
  ]);

  // Combine selected values for display
  const allSelectedValues = [...selectedCategory, ...selectedSubcategory];
  
  const handleSelectionChange = (values: string[]) => {
    const categoryIds: string[] = [];
    const subcategoryIds: string[] = [];
    
    values.forEach(value => {
      const category = categories.find(cat => cat.id === value);
      if (category) {
        categoryIds.push(value);
      } else {
        const subcategory = categories
          .flatMap(cat => cat.subcategories)
          .find(sub => sub.id === value);
        if (subcategory) {
          subcategoryIds.push(value);
        }
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
      <div>
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
    <div>
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
