import { supabase } from '../lib/supabaseClient';

export interface ProductImageData {
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}

export async function createProductImages(images: ProductImageData[]): Promise<void> {
  if (!images || images.length === 0) return;
  
  console.log('Saving to product_images...', images);
  const { error } = await supabase
    .from('product_images')
    .insert(images);

  if (error) {
    throw new Error('Failed to create product images: ' + error.message);
  }
  console.log('Saved successfully to product_images');
}
