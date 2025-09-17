import { ReactNode } from 'react';
import { HierarchicalSelector } from '@/components/HierarchicalSelector';
import { useSettingsState } from '@/hooks/useSettingsState';

interface BasicEntity {
  id: string;
  name: string;
  visible?: boolean;
}

type SettingsState = ReturnType<typeof useSettingsState>;

export interface HierarchicalSettingsSelectorProps {
  selectedParent: string;
  selectedChild: string;
  onSelectionChange: (parentId: string, childId: string) => void;
  invalid?: boolean;
}

interface HierarchicalSettingsSelectorConfig<
  TParent extends BasicEntity,
  TChild extends BasicEntity,
> {
  label: string;
  labelFor: string;
  placeholder: string;
  selectParents: (state: SettingsState) => TParent[];
  getChildren: (parent: TParent) => TChild[];
  includeGeneralOption?: boolean;
  requireChildSelection?: boolean;
  isParentVisible?: (parent: TParent) => boolean;
  isChildVisible?: (child: TChild) => boolean;
  getParentId?: (parent: TParent) => string;
  getParentName?: (parent: TParent) => string;
  getChildId?: (child: TChild) => string;
  getChildName?: (child: TChild) => string;
  renderParentHeader?: (parent: TParent) => ReactNode;
  renderGeneralLabel?: (parent: TParent) => ReactNode;
}

export function createHierarchicalSettingsSelector<
  TParent extends BasicEntity,
  TChild extends BasicEntity,
>({
  label,
  labelFor,
  placeholder,
  selectParents,
  getChildren,
  includeGeneralOption = false,
  requireChildSelection = false,
  isParentVisible,
  isChildVisible,
  getParentId = (parent) => parent.id,
  getParentName = (parent) => parent.name,
  getChildId = (child) => child.id,
  getChildName = (child) => child.name,
  renderParentHeader,
  renderGeneralLabel,
}: HierarchicalSettingsSelectorConfig<TParent, TChild>) {
  const parentVisibility =
    isParentVisible ?? ((parent: TParent) => parent.visible !== false);
  const childVisibility =
    isChildVisible ?? ((child: TChild) => child.visible !== false);
  const parentHeader =
    renderParentHeader ?? ((parent: TParent) => getParentName(parent));
  const generalLabel =
    renderGeneralLabel ??
    ((parent: TParent) => `General ${getParentName(parent)}`);

  function HierarchicalSettingsSelector({
    selectedParent,
    selectedChild,
    onSelectionChange,
    invalid = false,
  }: HierarchicalSettingsSelectorProps) {
    const settingsState = useSettingsState();
    const parents = selectParents(settingsState);

    return (
      <HierarchicalSelector
        label={label}
        labelFor={labelFor}
        placeholder={placeholder}
        parents={parents}
        selectedParent={selectedParent}
        selectedChild={selectedChild}
        onSelectionChange={onSelectionChange}
        getChildren={getChildren}
        getParentId={getParentId}
        getParentName={getParentName}
        getChildId={getChildId}
        getChildName={getChildName}
        invalid={invalid}
        includeGeneralOption={includeGeneralOption}
        requireChildSelection={requireChildSelection}
        isParentVisible={parentVisibility}
        isChildVisible={childVisibility}
        renderParentHeader={parentHeader}
        renderGeneralLabel={generalLabel}
      />
    );
  }

  HierarchicalSettingsSelector.displayName = 'HierarchicalSettingsSelector';

  return HierarchicalSettingsSelector;
}
