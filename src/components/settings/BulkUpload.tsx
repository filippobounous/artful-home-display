
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface BulkUploadProps {
  onUpload: (data: any[], type: string) => void;
}

export function BulkUpload({ onUpload }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive"
      });
    }
  };

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const parseLine = (line: string) => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current);
      return values.map(v => v.trim());
    };

    const headers = parseLine(lines[0]);
    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
    return data;
  };

  const handleUpload = async () => {
    if (!file || !uploadType) {
      toast({
        title: "Missing information",
        description: "Please select a file and upload type",
        variant: "destructive"
      });
      return;
    }

    try {
      const text = await file.text();
      const data = parseCsv(text);
      onUpload(data, uploadType);
      
      toast({
        title: "Upload successful",
        description: `${data.length} ${uploadType} records uploaded`
      });
      
      setFile(null);
      setUploadType("");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Error parsing CSV file",
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = (type: string) => {
    let template = "";
    let filename = "";
    
    switch (type) {
      case "houses":
        template = "name,country,address,yearBuilt,code\nMy House,United States,123 Main St,1985,MH01\nGuest House,United States,125 Main St,1990,GH01";
        filename = "houses-template.csv";
        break;
      case "rooms":
        template = "name,houseId\nLiving Room,main-house\nBedroom,main-house\nKitchen,guest-house";
        filename = "rooms-template.csv";
        break;
      case "categories":
        template = "name,icon\nArt,palette\nFurniture,sofa\nDecorative,lamp";
        filename = "categories-template.csv";
        break;
      case "items":
        template = "title,category,subcategory,house,room,description,condition,valuation,artist\nMy Artwork,art,painting,main-house,living-room,Beautiful painting,excellent,5000,Famous Artist";
        filename = "items-template.csv";
        break;
      default:
        return;
    }
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Upload via CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Upload Type</Label>
          <Select
            value={uploadType}
            onValueChange={setUploadType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select upload type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="houses">Houses</SelectItem>
              <SelectItem value="rooms">Rooms</SelectItem>
              <SelectItem value="categories">Categories</SelectItem>
              <SelectItem value="items">Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {uploadType && (
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">Download template for {uploadType}</span>
            <Button onClick={() => downloadTemplate(uploadType)} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        )}
        
        <div>
          <Label>CSV File</Label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            {file.name}
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || !uploadType} className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </Button>
      </CardContent>
    </Card>
  );
}
