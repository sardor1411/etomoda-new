import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { getCategories, createCategory, Category } from '../../services/categories';
import { addProductComplete } from '../../services/products';
import { uploadToS3 } from '../../services/storage';
import { AdvancedImageUploader, ImageItem } from '../../components/admin/AdvancedImageUploader';
import { Loader2, ArrowLeft, Save, AlertCircle, CheckCircle2, Search, X, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command';

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const colorSchema = z.object({
  color_name: z.string().min(1, "Majburiy"),
  color_hex: z.string().optional(),
  stock: z.coerce.number().min(0).default(0),
});

const sizeSchema = z.object({
  size: z.string().min(1, "Majburiy"),
  stock: z.coerce.number().min(0).default(0),
});

const formSchema = z.object({
  title: z.string().min(2, "Kamida 2 ta belgi"),
  slug: z.string().min(2, "Kamida 2 ta belgi"),
  description: z.string().min(10, 'Kamida 10 ta belgi bo\'lishi majburiy'),
  short_description: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, "Manfiy bo'lishi mumkin emas"),
  discount_price: z.coerce.number().optional(),
  discount_end_date: z.string().optional(),
  stock: z.coerce.number().min(0, "Manfiy bo'lishi mumkin emas"),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_active: z.boolean().default(true),
  category_id: z.string().min(1, "Kategoriya tanlang"),
  category: z.enum(['men', 'women', 'unisex']).default('unisex'),
  images: z.array(z.any()).min(1, "Kamida 1 ta rasm yuklang"),
  colors: z.array(colorSchema).optional(),
  sizes: z.array(sizeSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RECOMMENDED_COLORS = [
  { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' }, { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' }, { name: 'Green', hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' }, { name: 'Orange', hex: '#FFA500' },
  { name: 'Purple', hex: '#800080' }, { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' }, { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Navy', hex: '#000080' }, { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Gold', hex: '#FFD700' }, { name: 'Silver', hex: '#C0C0C0' },
];

const RECOMMENDED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Free Size', 'One Size'];

const NumberInput = React.forwardRef<HTMLInputElement, any>(({ value, onChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, ''); // Remove leading zeros
    onChange(val === '' ? '' : Number(val));
  };
  const displayValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : value === 0 ? "0" : "";
  return <Input ref={ref} type="text" value={displayValue} onChange={handleChange} {...props} />;
});
NumberInput.displayName = 'NumberInput';

export function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [categorySuccessMsg, setCategorySuccessMsg] = useState<string | null>(null);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  
  const [selectedColors, setSelectedColors] = useState<{name: string, hex: string, stock: number, image_id?: string}[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<{size: string, stock: number}[]>([]);

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '', slug: '', description: '', short_description: '', sku: '',
      price: 0, stock: 0, is_featured: false, is_new: true, is_active: true,
      images: [], colors: [], sizes: [], category_id: '', category: 'unisex'
    }
  });

  const titleWatch = watch('title');
  const catIdWatch = watch('category_id');

  useEffect(() => {
    if (titleWatch && !isDirty) {
      setValue('slug', generateSlug(titleWatch), { shouldValidate: true });
    }
  }, [titleWatch, setValue, isDirty]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const toggleColor = (color: typeof RECOMMENDED_COLORS[0]) => {
    setSelectedColors(prev => {
      const exists = prev.find(c => c.name === color.name);
      if (exists) return prev.filter(c => c.name !== color.name);
      return [...prev, { name: color.name, hex: color.hex, stock: 0 }];
    });
  };

  const updateColorStock = (name: string, stock: number) => {
    setSelectedColors(prev => prev.map(c => c.name === name ? { ...c, stock } : c));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const exists = prev.find(s => s.size === size);
      if (exists) return prev.filter(s => s.size !== size);
      return [...prev, { size, stock: 0 }];
    });
  };

  const updateSizeStock = (size: string, stock: number) => {
    setSelectedSizes(prev => prev.map(s => s.size === size ? { ...s, stock } : s));
  };

  const handleCreateCategory = async () => {
    const catName = categorySearch.trim();
    if (!catName || creatingCategory) return;
    
    if (catName.length < 2) {
      setErrorMsg('Kategoriya nomi kamida 2 ta belgi bo\'lishi kerak');
      return;
    }
    if (catName.length > 100) {
      setErrorMsg('Kategoriya nomi 100 ta belgidan oshmasligi kerak');
      return;
    }

    setCreatingCategory(true);
    setErrorMsg(null);
    try {
      const newCat = await createCategory(catName);
      setCategories(prev => [...prev, newCat]);
      setValue('category_id', newCat.id, { shouldValidate: true });
      setCategorySearchOpen(false);
      setCategorySearch('');
      setCategorySuccessMsg(`"${newCat.name}" muvaffaqiyatli qo'shildi`);
      setTimeout(() => setCategorySuccessMsg(null), 3000);
    } catch (error: any) {
      setErrorMsg(error.message || 'Kategoriya yaratishda xatolik');
    } finally {
      setCreatingCategory(false);
    }
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    setErrorMsg(null);
    setUploadProgress(0);
    try {
      // S3
      const uploadedImages = [];
      let i = 0;
      for (const img of values.images) {
        let url = '';
        if (img.file) {
          url = await uploadToS3(img.file);
        } else if (img.url) {
          url = img.url;
        }
        if (url) {
          uploadedImages.push({
            id: img.id || i.toString(),
            image_url: url,
            alt_text: img.alt_text || values.title,
            sort_order: i
          });
        }
        i++;
        setUploadProgress(Math.round((i / values.images.length) * 100));
      }

      const productData = {
        category_id: values.category_id,
        category: values.category,
        title: values.title,
        slug: values.slug,
        description: values.description,
        short_description: values.short_description,
        sku: values.sku,
        price: values.price,
        discount_price: typeof values.discount_price === 'number' ? values.discount_price : undefined,
        color_images: values.discount_end_date ? { discount_end_date: values.discount_end_date } : undefined,
        stock: values.stock,
        is_featured: values.is_featured,
        is_new: values.is_new,
        is_active: values.is_active
      };

      const colorsData = selectedColors.map(c => {
        let image_url = undefined;
        if (c.image_id) {
          const matchedImage = uploadedImages.find(img => img.id === c.image_id || img.sort_order.toString() === c.image_id);
          if (matchedImage) {
            image_url = matchedImage.image_url;
          }
        }
        return {
          color_name: c.name,
          color_hex: c.hex,
          stock: c.stock,
          image_url
        };
      });

      const dbImages = uploadedImages.map(img => ({
        image_url: img.image_url,
        alt_text: img.alt_text,
        sort_order: img.sort_order
      }));

      const sizesData = selectedSizes.map(s => ({
        size: s.size,
        stock: s.stock
      }));

      await addProductComplete(productData, dbImages, colorsData, sizesData);
      
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Noma\'lum xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
          <CheckCircle2 className="w-20 h-20" />
        </motion.div>
        <h2 className="text-2xl font-bold">Muvaffaqiyatli saqlandi!</h2>
        <p className="text-gray-500">Mahsulotlar ro'yxatiga yo'naltirilmoqda...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" render={<Link to="/admin/products" />}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yangi Mahsulot</h1>
            <p className="text-gray-500">Katalogingizga yangi mahsulot qo'shing</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {categorySuccessMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 border border-green-100 shadow-sm">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm font-medium">{categorySuccessMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="shadow-sm border-gray-100 overflow-hidden rounded-2xl bg-white/50 backdrop-blur-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle>Umumiy Ma'lumot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nomi *</Label>
                  <Input {...register('title')} placeholder="Masalan: Qora futbolka" className={errors.title ? "border-red-500 bg-red-50/50" : ""} />
                  {errors.title && <p className="text-sm text-red-500 font-medium">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>SEO Slug (URL) *</Label>
                  <Input {...register('slug')} placeholder="qora-futbolka" className={errors.slug ? "border-red-500 bg-red-50/50" : ""} />
                  {errors.slug && <p className="text-sm text-red-500 font-medium">{errors.slug.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Qisqacha Tavsif</Label>
                <Input {...register('short_description')} placeholder="Katalogda ko'rinadigan qisqa matn" />
              </div>

              <div className="space-y-2">
                <Label>To'liq Tavsif</Label>
                <Textarea {...register('description')} placeholder="Mahsulot haqida to'liq ma'lumot..." className="min-h-[150px] resize-y" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100 rounded-2xl bg-white/50 backdrop-blur-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle>Media</CardTitle>
              <CardDescription>Drag and drop or click to upload</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <AdvancedImageUploader 
                    images={field.value} 
                    onChange={field.onChange} 
                    error={errors.images?.message as string}
                  />
                )}
              />
              {errors.images && <p className="text-sm text-red-500 mt-2 font-medium">{errors.images.message}</p>}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100 rounded-2xl bg-white/50 backdrop-blur-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle>Variantlar</CardTitle>
              <CardDescription>Ranglar va o'lchamlarni belgilang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              
              {/* COLORS MANAGER */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Ranglar</Label>
                <div className="flex flex-wrap gap-2">
                  {RECOMMENDED_COLORS.map(color => {
                    const isSelected = selectedColors.some(c => c.name === color.name);
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                          isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
                
                {/* Custom Color Add */}
                <div className="flex items-center gap-3 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 w-fit">
                  <Input 
                    placeholder="Rang nomi (masalan: Oq-Qora)" 
                    className="w-48 h-9 text-sm"
                    id="customColorName"
                  />
                  <div className="flex items-center gap-2 bg-white border rounded-md px-2 h-9">
                    <input 
                      type="color" 
                      id="customColorHex"
                      defaultValue="#000000"
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const nameInput = document.getElementById('customColorName') as HTMLInputElement;
                      const hexInput = document.getElementById('customColorHex') as HTMLInputElement;
                      if (nameInput.value.trim()) {
                        toggleColor({ name: nameInput.value.trim(), hex: hexInput.value });
                        nameInput.value = '';
                      }
                    }}
                  >
                    Qo'shish
                  </Button>
                </div>

                <AnimatePresence>
                  {selectedColors.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 mt-4">
                      {selectedColors.map((color) => (
                        <div key={color.name} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 w-48">
                            <span className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: color.hex }} />
                            <span className="font-medium">{color.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-grow">
                            <Label className="text-gray-500 whitespace-nowrap">Rasm:</Label>
                            <select 
                              className="w-32 h-9 text-sm rounded-md border border-input bg-white px-3"
                              value={color.image_id || ''}
                              onChange={(e) => setSelectedColors(prev => prev.map(c => c.name === color.name ? { ...c, image_id: e.target.value } : c))}
                            >
                              <option value="">Rasm tanlang...</option>
                              {watch('images')?.map((img: any, i: number) => (
                                <option key={img.id || i} value={img.id || i.toString()}>
                                  {img.alt_text || `Rasm ${i + 1}`}
                                </option>
                              ))}
                            </select>
                            
                            <Label className="text-gray-500 whitespace-nowrap ml-2">Zaxira:</Label>
                            <Input 
                              type="text"
                              className="max-w-[120px] bg-white"
                              value={color.stock}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
                                updateColorStock(color.name, val === '' ? 0 : Number(val));
                              }}
                            />
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => toggleColor(color)} className="text-gray-400 hover:text-red-500 hover:bg-red-50">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-px bg-gray-100" />

              {/* SIZES MANAGER */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">O'lchamlar</Label>
                <div className="flex flex-wrap gap-2">
                  {RECOMMENDED_SIZES.map(size => {
                    const isSelected = selectedSizes.some(s => s.size === size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                          isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedSizes.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {selectedSizes.map((size) => (
                        <div key={size.size} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="font-semibold w-16">{size.size}</div>
                          <div className="flex items-center gap-2 flex-grow">
                            <Label className="text-gray-500 whitespace-nowrap text-xs">Zaxira:</Label>
                            <Input 
                              type="text"
                              className="w-full bg-white h-8"
                              value={size.stock}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
                                updateSizeStock(size.size, val === '' ? 0 : Number(val));
                              }}
                            />
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => toggleSize(size.size)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm border-gray-100 rounded-2xl bg-white/50 backdrop-blur-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle>Narx va Zaxira</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              
              <div className="space-y-2">
                <Label>Kategoriya *</Label>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
                      <PopoverTrigger render={
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categorySearchOpen}
                          className={`w-full justify-between bg-white ${!field.value ? "text-gray-500" : ""} ${errors.category_id ? "border-red-500 bg-red-50/50" : ""}`}
                        />
                      }>
                          {field.value
                            ? categories.find((category) => category.id === field.value)?.name
                            : "Kategoriyani tanlang..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput 
                            placeholder="Kategoriyani izlash..." 
                            value={categorySearch}
                            onValueChange={setCategorySearch}
                          />
                          <CommandList>
                            <CommandEmpty className="p-4 text-center text-sm">
                              <p className="text-gray-500 mb-3">Topilmadi. Yangi qo'shing.</p>
                              <Button 
                                type="button" 
                                size="sm" 
                                className="w-full" 
                                onClick={handleCreateCategory}
                                disabled={creatingCategory || !categorySearch.trim()}
                              >
                                {creatingCategory ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                "{categorySearch}" yaratish
                              </Button>
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.id}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    setCategorySearchOpen(false);
                                  }}
                                >
                                  <CheckCircle2
                                    className={`mr-2 h-4 w-4 ${
                                      field.value === category.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.category_id && <p className="text-sm text-red-500 font-medium">{errors.category_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Jinsi *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Jinsni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unisex">Barcha uchun (Unisex)</SelectItem>
                        <SelectItem value="men">Erkaklar uchun</SelectItem>
                        <SelectItem value="women">Ayollar uchun</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Narx *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Valyuta:</span>
                    <div className="flex items-center bg-gray-100 rounded-md p-1">
                      <button type="button" onClick={() => document.getElementById('price-currency-indicator')!.innerText = 'UZS'} className="px-2 py-0.5 text-xs rounded-sm bg-white shadow-sm font-medium">UZS</button>
                      <button type="button" onClick={() => document.getElementById('price-currency-indicator')!.innerText = 'USD'} className="px-2 py-0.5 text-xs rounded-sm hover:bg-white/50 text-gray-500 font-medium">USD</button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <NumberInput 
                        placeholder="0"
                        className={`pl-14 ${errors.price ? "border-red-500 bg-red-50/50" : ""}`}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span id="price-currency-indicator" className="text-gray-500 sm:text-sm font-medium">UZS</span>
                  </div>
                </div>
                {errors.price && <p className="text-sm text-red-500 font-medium">{errors.price.message}</p>}
                <p className="text-[11px] text-gray-400 leading-tight">Yozilgan narx aynan shu valyutada saqlanadi. (Masalan, 20 yoki 250000). Tizim summani avtomatik ajratadi.</p>
              </div>

              <div className="space-y-2">
                <Label>Chegirmali Narx (ixtiyoriy)</Label>
                <Controller
                  name="discount_price"
                  control={control}
                  render={({ field }) => (
                    <NumberInput 
                      placeholder="0"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Chegirma tugash vaqti (ixtiyoriy)</Label>
                <Controller
                  name="discount_end_date"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      type="datetime-local"
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="bg-white"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Umumiy Zaxira (dona) *</Label>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <NumberInput 
                      placeholder="0"
                      className={errors.stock ? "border-red-500 bg-red-50/50" : ""}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.stock && <p className="text-sm text-red-500 font-medium">{errors.stock.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>SKU (Shtrix kod)</Label>
                <Input {...register('sku')} placeholder="Masalan: PROD-001" className="bg-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100 rounded-2xl bg-white/50 backdrop-blur-xl">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Faol</Label>
                  <p className="text-sm text-gray-500">Saytda ko'rinishi</p>
                </div>
                <Controller name="is_active" control={control} render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yangi</Label>
                  <p className="text-sm text-gray-500">"Yangi" belgisi bilan</p>
                </div>
                <Controller name="is_new" control={control} render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tavsiya etilgan</Label>
                  <p className="text-sm text-gray-500">Asosiy sahifada ko'rinishi</p>
                </div>
                <Controller name="is_featured" control={control} render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200 flex justify-end z-40 lg:pl-64 shadow-2xl">
          <div className="flex items-center gap-4 max-w-6xl w-full mx-auto px-4 md:px-8 justify-end">
            {loading && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saqlanmoqda... {uploadProgress > 0 && uploadProgress < 100 ? `${uploadProgress}%` : ''}
              </div>
            )}
            <Button variant="outline" type="button" onClick={() => navigate('/admin/products')} disabled={loading} className="rounded-full px-6">
              Bekor qilish
            </Button>
            <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800 text-white min-w-[150px] rounded-full shadow-lg shadow-black/10">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Saqlash</>}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
