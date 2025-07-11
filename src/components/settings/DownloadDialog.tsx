
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { HouseConfig, CategoryConfig } from "@/types/inventory";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houses: HouseConfig[];
  categories: CategoryConfig[];
}

export function DownloadDialog({ open, onOpenChange, houses, categories }: DownloadDialogProps) {
  const [dataType, setDataType] = useState<string>("");
  const [format, setFormat] = useState<string>("");

  const handleDownload = () => {
    if (!dataType || !format) return;

    let data: any[] = [];
    let filename = "";

    switch (dataType) {
      case "houses":
        data = houses.map(h => ({
          id: h.id,
          name: h.name,
          city: h.city,
          country: h.country,
          address: h.address || '',
          postal_code: h.postal_code || '',
          code: h.code,
          icon: h.icon || '',
          visible: h.visible
        }));
        filename = `houses.${format}`;
        break;
      case "rooms":
        data = houses.flatMap(h => 
          h.rooms.map(r => ({
            id: r.id,
            name: r.name,
            house_code: r.house_code,
            houseId: h.id,
            houseName: h.name,
            code: r.code || '',
            room_type: r.room_type || '',
            floor: r.floor || 0,
            area_sqm: r.area_sqm || 0,
            windows: r.windows || 0,
            doors: r.doors || 0,
            description: r.description || '',
            notes: r.notes || '',
            visible: r.visible
          }))
        );
        filename = `rooms.${format}`;
        break;
      case "categories":
        data = categories.map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          visible: c.visible
        }));
        filename = `categories.${format}`;
        break;
      case "subcategories":
        data = categories.flatMap(c => 
          c.subcategories.map(s => ({
            id: s.id,
            name: s.name,
            categoryId: c.id,
            categoryName: c.name,
            visible: s.visible
          }))
        );
        filename = `subcategories.${format}`;
        break;
    }

    if (format === "csv") {
      downloadCSV(data, filename);
    } else {
      downloadJSON(data, filename);
    }

    onOpenChange(false);
    setDataType("");
    setFormat("");
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="data-type">Data Type</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type to download" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="houses">Houses</SelectItem>
                <SelectItem value="rooms">Rooms</SelectItem>
                <SelectItem value="categories">Categories</SelectItem>
                <SelectItem value="subcategories">Subcategories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select download format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={!dataType || !format}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
