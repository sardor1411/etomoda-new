import { supabase } from '../lib/supabaseClient';
import { createProductImages, ProductImageData } from './images';
import { createProductColors, ProductColorData } from './colors';
import { createProductSizes, ProductSizeData } from './sizes';

export interface CreateProductData {
  category_id: string;
  category?: string; // used for gender: 'men', 'women', 'unisex'
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price: number;
  discount_price?: number;
  stock: number;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_active?: boolean;
  color_images?: any;
}

export async function createProduct(data: CreateProductData): Promise<string> {
  const { data: inserted, error } = await supabase
    .from('products')
    .insert([data])
    .select('id')
    .single();

  if (error) {
    throw new Error('Failed to create product: ' + error.message);
  }

  return inserted.id;
}

export async function deleteProduct(productId: string): Promise<void> {
  // First delete related records if no CASCADE is set
  await supabase.from('product_images').delete().eq('product_id', productId);
  await supabase.from('product_colors').delete().eq('product_id', productId);
  await supabase.from('product_sizes').delete().eq('product_id', productId);
  await supabase.from('product_videos').delete().eq('product_id', productId);
  await supabase.from('reviews').delete().eq('product_id', productId);
  await supabase.from('wishlist_items').delete().eq('product_id', productId);
  await supabase.from('cart_items').delete().eq('product_id', productId);
  await supabase.from('order_items').delete().eq('product_id', productId);
  
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) {
    throw new Error('Failed to delete product: ' + error.message);
  }
}

export async function getProductComplete(productId: string) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError) throw productError;

  const { data: images } = await supabase.from('product_images').select('*').eq('product_id', productId).order('sort_order');
  const { data: colors } = await supabase.from('product_colors').select('*').eq('product_id', productId);
  const { data: sizes } = await supabase.from('product_sizes').select('*').eq('product_id', productId);

  return { product, images, colors, sizes };
}

export async function updateProductComplete(
  productId: string,
  productData: Partial<CreateProductData>,
  images: any[],
  colors: Omit<ProductColorData, 'product_id'>[],
  sizes: Omit<ProductSizeData, 'product_id'>[]
) {
  // Update main product
  const { error: updateError } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId);

  if (updateError) throw new Error('Failed to update product: ' + updateError.message);

  // For related tables, standard approach is delete all and re-insert
  // It's not the most efficient for images if we don't want to change URLs, but for a simple admin panel it's robust.
  // Wait, deleting images will remove them, but their URLs are passed.
  // Let's delete and re-insert images, colors, sizes.
  await supabase.from('product_images').delete().eq('product_id', productId);
  if (images.length > 0) {
    await createProductImages(images.map(img => ({ ...img, product_id: productId })));
  }

  await supabase.from('product_colors').delete().eq('product_id', productId);
  if (colors.length > 0) {
    await createProductColors(colors.map(color => ({ ...color, product_id: productId })));
  }

  await supabase.from('product_sizes').delete().eq('product_id', productId);
  if (sizes.length > 0) {
    await createProductSizes(sizes.map(size => ({ ...size, product_id: productId })));
  }
}

export async function addProductComplete(
  productData: CreateProductData,
  images: Omit<ProductImageData, 'product_id'>[],
  colors: Omit<ProductColorData, 'product_id'>[],
  sizes: Omit<ProductSizeData, 'product_id'>[]
) {
  let productId: string | null = null;
  try {
    productId = await createProduct(productData);

    if (images.length > 0) {
      await createProductImages(images.map(img => ({ ...img, product_id: productId! })));
    }
    
    if (colors.length > 0) {
      await createProductColors(colors.map(color => ({ ...color, product_id: productId! })));
    }
    
    if (sizes.length > 0) {
      await createProductSizes(sizes.map(size => ({ ...size, product_id: productId! })));
    }

    return productId;
  } catch (error) {
    // Basic rollback for the product itself if something fails during children insert
    if (productId) {
      await deleteProduct(productId).catch(console.error);
    }
    throw error;
  }
}

