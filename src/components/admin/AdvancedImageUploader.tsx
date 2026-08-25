import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, Reorder } from 'framer-motion';
import { Trash2, GripVertical, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export interface ImageItem {
  id: string;
  file?: File;
  previewUrl: string;
  isUploaded: boolean;
  s3Url?: string;
  alt_text?: string;
}

interface AdvancedImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  error?: string;
}

export function AdvancedImageUploader({ images, onChange, error }: AdvancedImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      isUploaded: false,
      alt_text: file.name
    }));
    onChange([...images, ...newImages]);
  }, [images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    }
  } as any);

  const removeImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    onChange(filtered);
  };

  const updateAltText = (id: string, text: string) => {
    const updated = images.map(img => img.id === id ? { ...img, alt_text: text } : img);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
        } ${error ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-700">Rasmlarni bu yerga tashlang yoki tanlash uchun bosing</p>
        <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP (Maksimal 5MB)</p>
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}

      {images.length > 0 && (
        <Reorder.Group axis="y" values={images} onReorder={onChange} className="space-y-2">
          {images.map((img) => (
            <Reorder.Item 
              key={img.id} 
              value={img} 
              className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="cursor-grab active:cursor-grabbing text-gray-400 p-1">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <Input 
                  placeholder="Alt text (SEO uchun)" 
                  value={img.alt_text || ''} 
                  onChange={(e) => updateAltText(img.id, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(img.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
