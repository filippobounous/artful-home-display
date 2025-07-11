import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { useSettingsState } from "@/hooks/useSettingsState";
import type { CheckedState } from "@radix-ui/react-checkbox";

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
  const visibleCategories = categories.filter((c) => c.visible);
  const combinedOptions = visibleCategories.flatMap((category) => {
    const subcategoryIds = category.subcategories
      .filter((s) => s.visible)
      .map((sub) => sub.id);
    const selectedSubs = selectedSubcategory.filter((id) =>
      subcategoryIds.includes(id),
    );
    const allSelected =
      selectedSubs.length === subcategoryIds.length &&
      subcategoryIds.length > 0;
    const checkState: CheckedState =
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
        onCheckChange: (checked: CheckedState) => {
          if (!permanentCategory) {
            if (checked) {
              if (!selectedCategory.includes(category.id)) {
                setSelectedCategory([...selectedCategory, category.id]);
              }
              setSelectedSubcategory([
                ...selectedSubcategory.filter(
                  (s) => !subcategoryIds.includes(s),
                ),
                ...subcategoryIds,
              ]);
            } else {
              setSelectedCategory(
                selectedCategory.filter((c) => c !== category.id),
              );
              setSelectedSubcategory(
                selectedSubcategory.filter((s) => !subcategoryIds.includes(s)),
              );
            }
          }
        },
      },
      ...category.subcategories
        .filter((s) => s.visible)
        .map((sub) => ({
          id: sub.id,
          name: sub.name,
          indent: true,
        })),
    ];
  });

  // Combine selected values for display
  const allSelectedValues = [...selectedCategory, ...selectedSubcategory];

  const selectedCount = visibleCategories.reduce((cnt, cat) => {
    const subIds = cat.subcategories.filter((s) => s.visible).map((s) => s.id);
    const subs = selectedSubcategory.filter((id) => subIds.includes(id));
    const allSel = subs.length === subIds.length && subIds.length > 0;
    if (selectedCategory.includes(cat.id) || allSel) {
      return cnt + 1;
    }
    return cnt + subs.length;
  }, 0);

  const handleSelectionChange = (values: string[]) => {
    const categoryIds: string[] = [];
    const subcategoryIds: string[] = [];

    visibleCategories.forEach((category) => {
      const subIds = category.subcategories
        .filter((s) => s.visible)
        .map((s) => s.id);
      const selectedSubs = values.filter((v) => subIds.includes(v));
      const allSelected =
        selectedSubs.length === subIds.length && subIds.length > 0;
      const hasCategory = values.includes(category.id);

      if (allSelected || (hasCategory && selectedSubs.length === 0)) {
        categoryIds.push(category.id);
      }

      if (allSelected) {
        subcategoryIds.push(...subIds);
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
    const permanentCat = categories.find((cat) => cat.id === permanentCategory);
    if (!permanentCat) return null;

    const subcategoryOptions = permanentCat.subcategories
      .filter((s) => s.visible)
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
      }));

    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Subcategories
        </label>
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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Categories & Subcategories
      </label>
      <MultiSelectFilter
        placeholder="Select categories or subcategories"
        options={combinedOptions}
        selectedValues={allSelectedValues}
        onSelectionChange={handleSelectionChange}
        selectedCount={selectedCount}
      />
    </div>
  );
}
