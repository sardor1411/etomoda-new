import { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { FileUploader } from './FileUploader';

export interface ColorData { color: string; image?: string }

export function ColorPicker({ colors, onChange }: { colors: ColorData[]; onChange: (c: ColorData[]) => void }) {
  const [newColor, setNewColor] = useState('#000000');

  const addColor = () => {
    if (!colors.find(c => c.color === newColor)) onChange([...colors, { color: newColor }]);
  };

  const removeColor = (color: string) => {
    onChange(colors.filter(c => c.color !== color));
  };

  const updateColorImage = (color: string, images: string[]) => {
      onChange(colors.map(c => c.color === color ? { ...c, image: images[0] } : c));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" />
        <Button onClick={addColor}>Qo'shish</Button>
      </div>
      <div className="space-y-2">
        {colors.map(c => (
          <div key={c.color} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
            <div style={{ backgroundColor: c.color }} className="w-8 h-8 rounded-full border" />
            <span className="text-xs font-mono">{c.color}</span>
            <div className="w-24">
                <FileUploader onUpload={(urls) => updateColorImage(c.color, urls)} multiple={false} maxFiles={1} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeColor(c.color)}><X size={14} /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
