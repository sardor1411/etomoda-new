import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadMedia } from '../../lib/api';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

export function FileUploader({ onUpload, multiple = false, maxFiles = 5 }: { onUpload: (url: string[]) => void; multiple?: boolean; maxFiles?: number }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    try {
      // Limit to maxFiles
      const filesToUpload = multiple ? acceptedFiles.slice(0, maxFiles - files.length) : acceptedFiles.slice(0, 1);
      const urls = await Promise.all(filesToUpload.map(file => uploadMedia(file)));
      const newFiles = multiple ? [...files, ...urls] : urls;
      setFiles(newFiles);
      onUpload(newFiles);
    } catch (error) {
      console.error('Upload Error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, [files, multiple, onUpload, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []}, multiple } as any);

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer ${isDragActive ? 'border-black' : 'border-black/10'}`}>
        <input {...getInputProps()} />
        {loading ? <Loader2 className="animate-spin mx-auto" /> : <Upload className="mx-auto text-gray-400" />}
        <p className="mt-2 text-sm text-gray-500">Rasm yuklash yoki tashlang</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {files.map((url, i) => (
          <div key={i} className="relative aspect-square">
            <img src={url} alt="upload" className="w-full h-full object-cover rounded-lg" />
            <Button variant="ghost" className="absolute top-1 right-1 p-1" onClick={() => {
              const newFiles = files.filter((_, idx) => idx !== i);
              setFiles(newFiles);
              onUpload(newFiles);
            }}><X /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
