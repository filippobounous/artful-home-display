import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { AddItemForm } from '@/components/AddItemForm';
import { useSearchParams } from 'react-router-dom';

const AddItem = () => {
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.has('draftId');

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
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
      </div>
    </div>
  );
};

export default AddItem;
