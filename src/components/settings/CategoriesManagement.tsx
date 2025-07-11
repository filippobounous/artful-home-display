
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconSelector } from "@/components/IconSelector";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { CategoryConfig } from "@/types/inventory";

interface CategoriesManagementProps {
  categories: CategoryConfig[];
  onAddCategory: (name: string, icon: string) => void;
  onAddSubcategory: (categoryId: string, subcategoryName: string) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  onMoveCategory: (dragIndex: number, hoverIndex: number) => void;
  onMoveSubcategory: (categoryId: string, dragIndex: number, hoverIndex: number) => void;
  onToggleCategory: (categoryId: string) => void;
  onToggleSubcategory: (categoryId: string, subcategoryId: string) => void;
}

export function CategoriesManagement({
  categories,
  onAddCategory,
  onAddSubcategory,
  onDeleteSubcategory,
  onMoveCategory,
  onMoveSubcategory,
  onToggleCategory,
  onToggleSubcategory
}: CategoriesManagementProps) {
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'folder' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', categoryId: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [draggedCategory, setDraggedCategory] = useState<number | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    onAddCategory(newCategory.name, newCategory.icon);
    setNewCategory({ name: '', icon: 'folder' });
    setShowAddCategory(false);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) return;
    onAddSubcategory(newSubcategory.categoryId, newSubcategory.name);
    setNewSubcategory({ name: '', categoryId: '' });
    setShowAddSubcategory(false);
  };

  const toggleCategoryCollapse = (categoryId: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId);
    } else {
      newCollapsed.add(categoryId);
    }
    setCollapsedCategories(newCollapsed);
  };

  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategory(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCategoryDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedCategory !== null && draggedCategory !== dropIndex) {
      onMoveCategory(draggedCategory, dropIndex);
    }
    setDraggedCategory(null);
  };

  const handleSubcategoryDragStart = (e: React.DragEvent, categoryId: string, subcategoryIndex: number) => {
    e.dataTransfer.setData('text/plain', `${categoryId}:${subcategoryIndex}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSubcategoryDrop = (e: React.DragEvent, categoryId: string, dropIndex: number) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData('text/plain');
    const [dragCategoryId, dragSubcategoryIndex] = dragData.split(':');
    
    if (dragCategoryId === categoryId && parseInt(dragSubcategoryIndex) !== dropIndex) {
      onMoveSubcategory(categoryId, parseInt(dragSubcategoryIndex), dropIndex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Categories & Subcategories</h4>
        <div className="flex gap-2">
          <Dialog open={showAddSubcategory} onOpenChange={setShowAddSubcategory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-select">Category</Label>
                  <Select value={newSubcategory.categoryId} onValueChange={(value) => setNewSubcategory({ ...newSubcategory, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input
                    id="subcategory-name"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                    placeholder="e.g., Modern Art, Vintage"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddSubcategory(false)}>Cancel</Button>
                  <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Electronics, Books"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <IconSelector
                    selectedIcon={newCategory.icon}
                    onIconSelect={(icon) => setNewCategory({ ...newCategory, icon })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, categoryIndex) => (
          <Card 
            key={category.id}
            draggable
            onDragStart={(e) => handleCategoryDragStart(e, categoryIndex)}
            onDragOver={handleCategoryDragOver}
            onDrop={(e) => handleCategoryDrop(e, categoryIndex)}
            className="cursor-move border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <span className="text-sm font-mono bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                        {category.id}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {category.subcategories.length} subcategories
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.visible}
                    onCheckedChange={() => onToggleCategory(category.id)}
                  />
                  {category.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Collapsible 
                open={!collapsedCategories.has(category.id)} 
                onOpenChange={() => toggleCategoryCollapse(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h5 className="font-medium text-sm text-muted-foreground">
                      Subcategories ({category.subcategories.length})
                    </h5>
                    {collapsedCategories.has(category.id) ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3">
                  {category.subcategories.map((subcategory, subcategoryIndex) => (
                    <div 
                      key={subcategory.id} 
                      className="flex items-center justify-between p-2 bg-muted/30 rounded cursor-move border border-border/30"
                      draggable
                      onDragStart={(e) => handleSubcategoryDragStart(e, category.id, subcategoryIndex)}
                      onDragOver={handleCategoryDragOver}
                      onDrop={(e) => handleSubcategoryDrop(e, category.id, subcategoryIndex)}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{subcategory.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={subcategory.visible}
                          onCheckedChange={() => onToggleSubcategory(category.id, subcategory.id)}
                        />
                        {subcategory.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{subcategory.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteSubcategory(category.id, subcategory.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
