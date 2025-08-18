import { AppLayout } from '@/components/AppLayout';
import { AddItemForm } from '@/components/AddItemForm';
import { useSearchParams } from 'react-router-dom';

const AddItem = () => {
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.has('draftId');

  return (
    <AppLayout>
      <div className="p-6">
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
      </div>
    </AppLayout>
  );
};

export default AddItem;
