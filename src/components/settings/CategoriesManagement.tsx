import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IconSelector } from "@/components/IconSelector";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { CategoryConfig, SubcategoryConfig } from "@/types/inventory";

interface CategoriesManagementProps {
  categories: CategoryConfig[];
  onAddCategory: (name: string, icon: string) => void;
  onAddSubcategory: (categoryId: string, subcategoryName: string) => void;
  onEditCategory: (
    categoryId: string,
    updates: Partial<CategoryConfig>,
  ) => void;
  onEditSubcategory: (
    categoryId: string,
    subcategoryId: string,
    updates: Partial<SubcategoryConfig>,
  ) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  onMoveCategory: (dragIndex: number, hoverIndex: number) => void;
  onMoveSubcategory: (
    categoryId: string,
    dragIndex: number,
    hoverIndex: number,
  ) => void;
  onToggleCategory: (categoryId: string) => void;
  onToggleSubcategory: (categoryId: string, subcategoryId: string) => void;
}

export function CategoriesManagement({
  categories,
  onAddCategory,
  onAddSubcategory,
  onEditCategory,
  onEditSubcategory,
  onDeleteSubcategory,
  onMoveCategory,
  onMoveSubcategory,
  onToggleCategory,
  onToggleSubcategory,
}: CategoriesManagementProps) {
  const [newCategory, setNewCategory] = useState({ name: "", icon: "folder" });
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    categoryId: "",
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [draggedCategory, setDraggedCategory] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(
    null,
  );
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<{
    categoryId: string;
    subcategory: SubcategoryConfig;
  } | null>(null);
  const [showEditSubcategory, setShowEditSubcategory] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    onAddCategory(newCategory.name, newCategory.icon);
    setNewCategory({ name: "", icon: "folder" });
    setShowAddCategory(false);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) return;
    onAddSubcategory(newSubcategory.categoryId, newSubcategory.name);
    setNewSubcategory({ name: "", categoryId: "" });
    setShowAddSubcategory(false);
  };

  const handleEditCategory = () => {
    if (!editingCategory) return;
    onEditCategory(editingCategory.id, {
      name: editingCategory.name,
      icon: editingCategory.icon,
    });
    setEditingCategory(null);
    setShowEditCategory(false);
  };

  const handleEditSubcategory = () => {
    if (!editingSubcategory) return;
    onEditSubcategory(
      editingSubcategory.categoryId,
      editingSubcategory.subcategory.id,
      { name: editingSubcategory.subcategory.name },
    );
    setEditingSubcategory(null);
    setShowEditSubcategory(false);
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
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCategoryDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedCategory !== null && draggedCategory !== dropIndex) {
      onMoveCategory(draggedCategory, dropIndex);
    }
    setDraggedCategory(null);
  };

  const handleSubcategoryDragStart = (
    e: React.DragEvent,
    categoryId: string,
    subcategoryIndex: number,
  ) => {
    e.dataTransfer.setData("text/plain", `${categoryId}:${subcategoryIndex}`);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSubcategoryDrop = (
    e: React.DragEvent,
    categoryId: string,
    dropIndex: number,
  ) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData("text/plain");
    const [dragCategoryId, dragSubcategoryIndex] = dragData.split(":");

    if (
      dragCategoryId === categoryId &&
      parseInt(dragSubcategoryIndex) !== dropIndex
    ) {
      onMoveSubcategory(categoryId, parseInt(dragSubcategoryIndex), dropIndex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Categories & Subcategories</h4>
        <div className="flex gap-2">
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
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="e.g., Electronics, Books"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <IconSelector
                    selectedIcon={newCategory.icon}
                    onIconSelect={(icon) =>
                      setNewCategory({ ...newCategory, icon })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancel
                  </Button>
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
            className="cursor-move border-border bg-card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <span className="text-sm font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
                        {category.id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setShowEditCategory(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={category.visible}
                    onCheckedChange={() => onToggleCategory(category.id)}
                  />
                  {category.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={!collapsedCategories.has(category.id)}
                onOpenChange={() => toggleCategoryCollapse(category.id)}
              >
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto">
                      {collapsedCategories.has(category.id) ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setNewSubcategory({
                            name: "",
                            categoryId: category.id,
                          })
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Add Subcategory to {category.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subcategory-name">
                            Subcategory Name
                          </Label>
                          <Input
                            id="subcategory-name"
                            value={newSubcategory.name}
                            onChange={(e) =>
                              setNewSubcategory({
                                ...newSubcategory,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Modern Art, Vintage"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setNewSubcategory({ name: "", categoryId: "" })
                            }
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddSubcategory}>
                            Add Subcategory
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <h5 className="font-medium text-sm text-muted-foreground ml-1">
                    Subcategories ({category.subcategories.length})
                  </h5>
                </div>
                <CollapsibleContent className="space-y-2 mt-3">
                  {category.subcategories.map(
                    (subcategory, subcategoryIndex) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-move border border-border"
                        draggable
                        onDragStart={(e) =>
                          handleSubcategoryDragStart(
                            e,
                            category.id,
                            subcategoryIndex,
                          )
                        }
                        onDragOver={handleCategoryDragOver}
                        onDrop={(e) =>
                          handleSubcategoryDrop(
                            e,
                            category.id,
                            subcategoryIndex,
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{subcategory.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={subcategory.visible}
                            onCheckedChange={() =>
                              onToggleSubcategory(category.id, subcategory.id)
                            }
                          />
                          {subcategory.visible ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSubcategory({
                                categoryId: category.id,
                                subcategory,
                              });
                              setShowEditSubcategory(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Subcategory
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {subcategory.name}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    onDeleteSubcategory(
                                      category.id,
                                      subcategory.id,
                                    )
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ),
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Icon</Label>
                <IconSelector
                  selectedIcon={editingCategory.icon}
                  onIconSelect={(icon) =>
                    setEditingCategory({ ...editingCategory, icon })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditCategory(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditCategory}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditSubcategory} onOpenChange={setShowEditSubcategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          {editingSubcategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-subcategory-name">Subcategory Name</Label>
                <Input
                  id="edit-subcategory-name"
                  value={editingSubcategory.subcategory.name}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      subcategory: {
                        ...editingSubcategory.subcategory,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditSubcategory(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditSubcategory}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
