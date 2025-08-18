import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { InventoryHeader } from '@/components/InventoryHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Drafts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState(() => {
    const stored = localStorage.getItem('drafts');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('drafts', JSON.stringify(drafts));
  }, [drafts]);

  const deleteDraft = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    toast({
      title: 'Draft deleted',
      description: 'The draft has been removed successfully',
    });
  };

  const editDraft = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const draft = drafts.find((d) => d.id === id);
    if (draft) {
      // Store complete draft data in localStorage for the AddItem page to pick up
      localStorage.setItem(
        'editingDraft',
        JSON.stringify({
          id: draft.id,
          ...draft.data,
          lastModified: draft.lastModified,
        }),
      );

      toast({
        title: 'Loading draft',
        description: 'Redirecting to edit mode...',
      });

      navigate(`/add?draftId=${id}`);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <InventoryHeader />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Drafts
            </h2>
            <p className="text-muted-foreground">Your saved draft items</p>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No drafts yet
              </h3>
              <p className="text-muted-foreground">
                Start adding items and save them as drafts
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {drafts.map((draft) => (
                <Card key={draft.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {draft.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {draft.description}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span>Last modified: {draft.lastModified}</span>
                          <span>Category: {draft.category}</span>
                          {draft.data.house && (
                            <span>House: {draft.data.house}</span>
                          )}
                          {draft.data.room && (
                            <span>Room: {draft.data.room}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => editDraft(draft.id, e)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => deleteDraft(draft.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Drafts;
