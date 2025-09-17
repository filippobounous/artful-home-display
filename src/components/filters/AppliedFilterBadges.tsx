import type { ComponentProps } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

export interface AppliedFilterOption {
  label: string;
  variant?: BadgeVariant;
}

export interface AppliedFilterBadgeGroup {
  id: string;
  labelPrefix: string;
  selectedIds: string[];
  options: Record<string, AppliedFilterOption | undefined>;
  onRemove: (id: string) => void;
  variant?: BadgeVariant;
  locked?: boolean | ((id: string) => boolean);
}

interface AppliedFilterBadgesProps {
  groups: AppliedFilterBadgeGroup[];
}

export function AppliedFilterBadges({ groups }: AppliedFilterBadgesProps) {
  return (
    <>
      {groups.flatMap((group) =>
        group.selectedIds.map((id) => {
          const option = group.options[id];
          const label = option?.label ?? id;
          const variant = option?.variant ?? group.variant ?? 'default';
          const isLocked =
            typeof group.locked === 'function'
              ? group.locked(id)
              : Boolean(group.locked);

          return (
            <Badge key={`${group.id}-${id}`} variant={variant} className="px-3 py-1">
              {group.labelPrefix}: {label}
              {!isLocked && (
                <X
                  className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive"
                  onClick={() => group.onRemove(id)}
                />
              )}
            </Badge>
          );
        }),
      )}
    </>
  );
}
