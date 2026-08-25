import { supabase } from '../lib/supabaseClient';

export interface ProductSizeData {
  product_id: string;
  size: string;
  stock?: number;
}

export async function createProductSizes(sizes: ProductSizeData[]): Promise<void> {
  if (!sizes || sizes.length === 0) return;

  const { error } = await supabase
    .from('product_sizes')
    .insert(sizes);

  if (error) {
    throw new Error('Failed to create product sizes: ' + error.message);
  }
}
