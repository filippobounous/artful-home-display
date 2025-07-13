import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload, Image } from 'lucide-react';

interface AddItemImagesProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

export function AddItemImages({ formData, setFormData }: AddItemImagesProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, imageUrl],
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <Label>Images</Label>

      {/* File Upload */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Or enter image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={addImageUrl}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {formData.images.length === 0 && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No images added yet</p>
        </div>
      )}
    </div>
  );
}
