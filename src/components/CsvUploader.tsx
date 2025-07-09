
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CsvUploaderProps {
  onUpload: (data: any[], type: string) => void;
}

export function CsvUploader({ onUpload }: CsvUploaderProps) {
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
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
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
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select upload type</option>
            <option value="houses">Houses</option>
            <option value="rooms">Rooms</option>
            <option value="categories">Categories</option>
            <option value="items">Items</option>
          </select>
        </div>
        
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

        <div className="text-xs text-gray-500">
          <p><strong>CSV Format Examples:</strong></p>
          <p><strong>Houses:</strong> name,city,country,address,postal_code,code,beneficiary,latitude,longitude,description,notes</p>
          <p><strong>Categories:</strong> name,icon</p>
          <p><strong>Rooms:</strong> name,houseId</p>
          <p><strong>Items:</strong> title,category,subcategory,house,room,widthCm,heightCm,depthCm,description,valuation,artist</p>
        </div>
      </CardContent>
    </Card>
  );
}
