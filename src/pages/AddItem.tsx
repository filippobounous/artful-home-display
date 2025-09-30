import { InventoryHeader } from '@/components/InventoryHeader';
import { AddItemForm } from '@/components/AddItemForm';
import { useSearchParams } from 'react-router-dom';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useAuth } from '@/hooks/useAuth';

const AddItem = () => {
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.has('draftId');
  const { canWrite } = useAuth();

  if (!canWrite) {
    return (
      <SidebarLayout>
        <InventoryHeader />
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              View-only access
            </h2>
            <p className="text-muted-foreground">
              You don&apos;t have permission to add or edit items. Please
              contact an administrator if you need write access.
            </p>
          </div>
        </main>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <InventoryHeader />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {isEditMode ? 'Edit Item' : 'Add New Item'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Update details for your item'
              : 'Add a new piece to your collection'}
          </p>
        </div>

        <AddItemForm />
      </main>
    </SidebarLayout>
  );
};

export default AddItem;
