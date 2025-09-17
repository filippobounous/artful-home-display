import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { Label } from '@/components/ui/label';
import type { CheckedState } from '@radix-ui/react-checkbox';

export const ParentSelectionMode = {
  ParentControlsChildren: 'parentControlsChildren',
  ChildrenControlParent: 'childrenControlParent',
} as const;

export type ParentSelectionMode =
  (typeof ParentSelectionMode)[keyof typeof ParentSelectionMode];

interface HierarchicalMultiSelectFilterProps<P, C> {
  parents: P[];
  getParentId: (parent: P) => string;
  getParentName: (parent: P) => string;
  getParentVisible?: (parent: P) => boolean;
  getChildren: (parent: P) => C[];
  getChildId: (parent: P, child: C) => string;
  getChildName: (parent: P, child: C) => string;
  isChildVisible?: (parent: P, child: C) => boolean;
  selectedParentIds: string[];
  setSelectedParentIds: (ids: string[]) => void;
  selectedChildIds: string[];
  setSelectedChildIds: (ids: string[]) => void;
  permanentParentId?: string;
  label: string;
  placeholder: string;
  childOnlyLabel: string;
  childOnlyPlaceholder: string;
  parentSelectionMode?: ParentSelectionMode;
  className?: string;
}

export function HierarchicalMultiSelectFilter<P, C>({
  parents,
  getParentId,
  getParentName,
  getParentVisible,
  getChildren,
  getChildId,
  getChildName,
  isChildVisible,
  selectedParentIds,
  setSelectedParentIds,
  selectedChildIds,
  setSelectedChildIds,
  permanentParentId,
  label,
  placeholder,
  childOnlyLabel,
  childOnlyPlaceholder,
  parentSelectionMode = ParentSelectionMode.ParentControlsChildren,
  className = 'md:col-span-2',
}: HierarchicalMultiSelectFilterProps<P, C>) {
  const isParentVisible = getParentVisible ?? (() => true);
  const isChildVisibleForParent =
    isChildVisible ?? (() => true);

  if (permanentParentId) {
    const permanentParent = parents.find(
      (parent) => getParentId(parent) === permanentParentId,
    );
    if (!permanentParent) return null;

    const childOptions = getChildren(permanentParent)
      .filter((child) =>
        isChildVisibleForParent(permanentParent, child),
      )
      .map((child) => ({
        id: getChildId(permanentParent, child),
        name: getChildName(permanentParent, child),
      }));

    return (
      <div className={className}>
        <Label className="block text-sm font-medium text-muted-foreground mb-2">
          {childOnlyLabel}
        </Label>
        <MultiSelectFilter
          placeholder={childOnlyPlaceholder}
          options={childOptions}
          selectedValues={selectedChildIds}
          onSelectionChange={setSelectedChildIds}
        />
      </div>
    );
  }

  const visibleParents = parents.filter((parent) =>
    isParentVisible(parent),
  );

  const combinedOptions = visibleParents.flatMap((parent) => {
    const parentId = getParentId(parent);
    const children = getChildren(parent).filter((child) =>
      isChildVisibleForParent(parent, child),
    );
    const childIds = children.map((child) =>
      getChildId(parent, child),
    );
    const selectedChildren = selectedChildIds.filter((id) =>
      childIds.includes(id),
    );
    const allChildrenSelected =
      selectedChildren.length === childIds.length &&
      childIds.length > 0;
    const parentSelected = selectedParentIds.includes(parentId);
    const checkState: CheckedState = parentSelected || allChildrenSelected
      ? true
      : selectedChildren.length > 0
        ? 'indeterminate'
        : false;

    return [
      {
        id: parentId,
        name: getParentName(parent),
        header: true,
        checkState,
        onCheckChange: (checked: CheckedState) => {
          if (checked) {
            const newParentIds = selectedParentIds.includes(parentId)
              ? selectedParentIds
              : [...selectedParentIds, parentId];
            const childSet = new Set(selectedChildIds);
            childIds.forEach((id) => childSet.add(id));
            setSelectedParentIds(newParentIds);
            setSelectedChildIds(Array.from(childSet));
          } else {
            setSelectedParentIds(
              selectedParentIds.filter((id) => id !== parentId),
            );
            setSelectedChildIds(
              selectedChildIds.filter((id) => !childIds.includes(id)),
            );
          }
        },
      },
      ...children.map((child) => ({
        id: getChildId(parent, child),
        name: getChildName(parent, child),
        indent: true,
      })),
    ];
  });

  const allSelectedValues = [
    ...selectedParentIds,
    ...selectedChildIds,
  ];

  const selectedCount = visibleParents.reduce((count, parent) => {
    const childIds = getChildren(parent)
      .filter((child) => isChildVisibleForParent(parent, child))
      .map((child) => getChildId(parent, child));
    const selectedChildren = selectedChildIds.filter((id) =>
      childIds.includes(id),
    );
    const allChildrenSelected =
      selectedChildren.length === childIds.length &&
      childIds.length > 0;
    const parentSelected = selectedParentIds.includes(
      getParentId(parent),
    );

    if (parentSelected || allChildrenSelected) {
      return count + 1;
    }

    return count + selectedChildren.length;
  }, 0);

  const handleSelectionChange = (values: string[]) => {
    const nextParentIds: string[] = [];
    const nextChildIds: string[] = [];

    visibleParents.forEach((parent) => {
      const parentId = getParentId(parent);
      const children = getChildren(parent).filter((child) =>
        isChildVisibleForParent(parent, child),
      );
      const childIds = children.map((child) =>
        getChildId(parent, child),
      );
      const selectedChildren = values.filter((value) =>
        childIds.includes(value),
      );
      const allChildrenSelected =
        selectedChildren.length === childIds.length &&
        childIds.length > 0;
      const parentSelected = values.includes(parentId);

      if (parentSelectionMode === ParentSelectionMode.ChildrenControlParent) {
        if (allChildrenSelected || (parentSelected && selectedChildren.length === 0)) {
          nextParentIds.push(parentId);
        }

        if (allChildrenSelected) {
          nextChildIds.push(...childIds);
        } else {
          nextChildIds.push(...selectedChildren);
        }
      } else {
        if (parentSelected || allChildrenSelected) {
          nextParentIds.push(parentId);
          nextChildIds.push(...childIds);
        } else {
          nextChildIds.push(...selectedChildren);
        }
      }
    });

    const uniqueChildIds = Array.from(new Set(nextChildIds));
    setSelectedParentIds(nextParentIds);
    setSelectedChildIds(uniqueChildIds);
  };

  return (
    <div className={className}>
      <Label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </Label>
      <MultiSelectFilter
        placeholder={placeholder}
        options={combinedOptions}
        selectedValues={allSelectedValues}
        onSelectionChange={handleSelectionChange}
        selectedCount={selectedCount}
      />
    </div>
  );
}
