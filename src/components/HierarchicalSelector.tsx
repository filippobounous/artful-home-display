import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface BasicItem {
  id: string;
  name: string;
  visible?: boolean;
}

interface HierarchicalSelectorProps<TParent extends BasicItem, TChild extends BasicItem> {
  label: string;
  labelFor?: string;
  placeholder: string;
  parents: TParent[];
  selectedParent: string;
  selectedChild: string;
  onSelectionChange: (parentId: string, childId: string) => void;
  getChildren: (parent: TParent) => TChild[];
  getParentId: (parent: TParent) => string;
  getParentName: (parent: TParent) => string;
  getChildId: (child: TChild) => string;
  getChildName: (child: TChild) => string;
  invalid?: boolean;
  includeGeneralOption?: boolean;
  requireChildSelection?: boolean;
  isParentVisible?: (parent: TParent) => boolean;
  isChildVisible?: (child: TChild) => boolean;
  renderParentHeader?: (parent: TParent) => ReactNode;
  renderGeneralLabel?: (parent: TParent) => ReactNode;
}

export function HierarchicalSelector<
  TParent extends BasicItem,
  TChild extends BasicItem,
>({
  label,
  labelFor,
  placeholder,
  parents,
  selectedParent,
  selectedChild,
  onSelectionChange,
  getChildren,
  getParentId,
  getParentName,
  getChildId,
  getChildName,
  invalid = false,
  includeGeneralOption = false,
  requireChildSelection = false,
  isParentVisible = (parent) => parent.visible !== false,
  isChildVisible = (child) => child.visible !== false,
  renderParentHeader = (parent) => getParentName(parent),
  renderGeneralLabel = (parent) => `General ${getParentName(parent)}`,
}: HierarchicalSelectorProps<TParent, TChild>) {
  const hasParent = Boolean(selectedParent);
  const hasChild = Boolean(selectedChild);
  const shouldShowValue = requireChildSelection ? hasParent && hasChild : hasParent;
  const currentValue = shouldShowValue
    ? `${selectedParent}|${selectedChild || ''}`
    : '';

  const handleSelectionChange = (value: string) => {
    if (!value) {
      onSelectionChange('', '');
      return;
    }

    const [parentId, childId = ''] = value.split('|');
    onSelectionChange(parentId, childId);
  };

  return (
    <div>
      <Label htmlFor={labelFor}>{label}</Label>
      <Select value={currentValue} onValueChange={handleSelectionChange}>
        <SelectTrigger
          className={cn(
            currentValue ? undefined : 'text-muted-foreground',
            invalid && 'border-destructive focus:ring-destructive',
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {parents.filter(isParentVisible).map((parent) => {
            const parentId = getParentId(parent);
            const children = getChildren(parent).filter(isChildVisible);

            return (
              <div key={parentId}>
                <div className="px-2 py-1 text-sm font-medium text-muted-foreground bg-muted">
                  {renderParentHeader(parent)}
                </div>
                {includeGeneralOption && (
                  <SelectItem value={`${parentId}|`} className="pl-6 font-medium">
                    {renderGeneralLabel(parent)}
                  </SelectItem>
                )}
                {children.map((child) => {
                  const childId = getChildId(child);
                  return (
                    <SelectItem
                      key={`${parentId}|${childId}`}
                      value={`${parentId}|${childId}`}
                      className="pl-6"
                    >
                      {getChildName(child)}
                    </SelectItem>
                  );
                })}
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
