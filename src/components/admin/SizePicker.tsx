import { Button } from '../ui/button';

export function SizePicker({ sizes, onChange }: { sizes: string[]; onChange: (s: string[]) => void }) {
  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      onChange(sizes.filter(s => s !== size));
    } else {
      onChange([...sizes, size]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
        <Button 
          key={s} 
          variant={sizes.includes(s) ? 'default' : 'outline'} 
          onClick={() => toggleSize(s)}
          className="rounded-full"
        >
          {s}
        </Button>
      ))}
    </div>
  );
}
