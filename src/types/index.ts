export interface Product {
  id: string;
  category_id: string;
  category?: string; // used for gender
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
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  color_images?: {
    discount_end_date?: string;
    [key: string]: any;
  };

  // Joined relations for frontend use
  product_images?: ProductImage[];
  product_colors?: ProductColor[];
  product_sizes?: ProductSize[];
  categories?: { id: string; name: string };
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface ProductColor {
  id: string;
  product_id: string;
  color_name: string;
  color_hex?: string;
  stock: number;
  image_url?: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  stock: number;
}

export interface CartItem {
  id: string; // product id + color + size
  productId: string;
  title: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}
