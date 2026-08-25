import { supabase } from '../lib/supabaseClient';

export interface ProductColorData {
  product_id: string;
  color_name: string;
  color_hex?: string;
  stock?: number;
  image_url?: string;
}

export async function createProductColors(colors: ProductColorData[]): Promise<void> {
  if (!colors || colors.length === 0) return;

  const { error } = await supabase
    .from('product_colors')
    .insert(colors);

  if (error) {
    throw new Error('Failed to create product colors: ' + error.message);
  }
}
