
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
  onCsvUpload: (data: any[], type: string) => void;
  onJsonUpload: (data: any[], type: string) => void;
}

export function BulkUpload({ onCsvUpload, onJsonUpload }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json'))) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV or JSON file",
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

  const parseJson = (text: string) => {
    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
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
      let data: any[];
      
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        data = parseJson(text);
        onJsonUpload(data, uploadType);
      } else {
        data = parseCsv(text);
        onCsvUpload(data, uploadType);
      }
      
      toast({
        title: "Upload successful",
        description: `${data.length} ${uploadType} records uploaded`
      });
      
      setFile(null);
      setUploadType("");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Error parsing file",
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = (type: string, format: 'csv' | 'json') => {
    let data: any[] = [];
    let filename = "";
    
    switch (type) {
      case "houses":
        data = [{
          name: "Main House",
          city: "Beverly Hills",
          country: "United States",
          address: "123 Main St",
          postal_code: "90210",
          code: "MH01",
          icon: "home",
          yearBuilt: "2020",
          visible: true
        }];
        filename = `houses-template.${format}`;
        break;
      case "rooms":
        data = [{
          name: "Living Room",
          houseId: "main-house",
          code: "LR01",
          room_type: "living",
          floor: 1,
          area_sqm: 25.5,
          windows: 2,
          doors: 1,
          description: "Spacious living room with natural light",
          notes: "Recently renovated",
          visible: true
        }];
        filename = `rooms-template.${format}`;
        break;
      case "categories":
        data = [{
          name: "Art",
          icon: "palette",
          visible: true
        }];
        filename = `categories-template.${format}`;
        break;
      case "subcategories":
        data = [{
          name: "Paintings",
          categoryId: "art",
          visible: true
        }];
        filename = `subcategories-template.${format}`;
        break;
      case "items":
        data = [{
          title: "My Artwork",
          category: "art",
          subcategory: "painting",
          house: "main-house",
          room: "living-room",
          widthCm: 60,
          heightCm: 90,
          depthCm: 5,
          description: "Beautiful painting",
          valuation: 5000,
          artist: "Famous Artist",
          year: 2020,
          materials: "Oil on canvas",
          condition: "Excellent",
          provenance: "Gallery purchase",
          insurance_value: 5500,
          notes: "Purchased in 2020"
        }];
        filename = `items-template.${format}`;
        break;
      default:
        return;
    }
    
    if (format === 'csv') {
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
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Upload via CSV/JSON
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
              <SelectItem value="subcategories">Subcategories</SelectItem>
              <SelectItem value="items">Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {uploadType && (
          <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg border border-border/50">
            <span className="text-sm text-foreground">Download template for {uploadType}</span>
            <div className="flex gap-2">
              <Button onClick={() => downloadTemplate(uploadType, 'csv')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => downloadTemplate(uploadType, 'json')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        )}
        
        <div>
          <Label>File (CSV or JSON)</Label>
          <Input
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            {file.name}
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || !uploadType} className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </CardContent>
    </Card>
  );
}
