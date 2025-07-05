import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Download } from "lucide-react";
import { IconSelector } from "@/components/IconSelector";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CategoriesManagementProps {
  categories: any[];
  onAddCategory: (name: string, icon: string) => void;
  onAddSubcategory: (categoryId: string, subcategoryName: string) => void;
  onDeleteSubcategory?: (categoryId: string, subcategoryId: string) => void;
}

export function CategoriesManagement({ categories, onAddCategory, onAddSubcategory, onDeleteSubcategory }: CategoriesManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("palette");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { toast } = useToast();

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName, newCategoryIcon);
      
      toast({
        title: "Category added",
        description: `${newCategoryName} has been added successfully`
      });
      
      setNewCategoryName("");
      setNewCategoryIcon("palette");
    } else {
      toast({
        title: "Missing information",
        description: "Please enter a category name",
        variant: "destructive"
      });
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategory) {
      onAddSubcategory(selectedCategory, newSubcategoryName);
      
      toast({
        title: "Subcategory added",
        description: `${newSubcategoryName} has been added successfully`
      });
      
      setNewSubcategoryName("");
    } else {
      toast({
        title: "Missing information",
        description: "Please select a category and enter subcategory name",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    if (onDeleteSubcategory) {
      onDeleteSubcategory(categoryId, subcategoryId);
      toast({
        title: "Subcategory deleted",
        description: "Subcategory has been removed successfully"
      });
    }
  };

  const downloadCategoriesTemplate = () => {
    const template = "name,icon\nArt,palette\nFurniture,sofa\nDecorative,lamp";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Categories Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Categories</CardTitle>
          <Button onClick={downloadCategoriesTemplate} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <Label>Category Name</Label>
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="mt-1">
                <IconSelector
                  selectedIcon={newCategoryIcon}
                  onIconSelect={setNewCategoryIcon}
                />
              </div>
            </div>
          </div>
          
          <Button onClick={handleAddCategory} className="w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
          
          <div className="space-y-2">
            <Label>Current Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id} variant="secondary" className="px-3 py-1">
                  {category.name}
                  <button className="ml-2 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subcategories Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Subcategories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Subcategory name"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              className="flex-1"
              disabled={!selectedCategory}
            />
            <Button onClick={handleAddSubcategory} disabled={!selectedCategory}>
              <Plus className="w-4 h-4 mr-1" />
              Add Subcategory
            </Button>
          </div>
          
          {selectedCategory && (
            <div className="space-y-2">
              <Label>Subcategories in {categories.find(c => c.id === selectedCategory)?.name}</Label>
              <div className="flex flex-wrap gap-2">
                {categories
                  .find(c => c.id === selectedCategory)
                  ?.subcategories.map((subcategory) => (
                    <Badge key={subcategory.id} variant="secondary" className="px-3 py-1">
                      {subcategory.name}
                      <button 
                        className="ml-2 hover:text-destructive"
                        onClick={() => handleDeleteSubcategory(selectedCategory, subcategory.id)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
