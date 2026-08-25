import { Product, ProductImage, ProductColor, ProductSize } from '../../types';
import { Category } from '../../services/categories';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-tops', name: 'Tops & Shirts', slug: 'tops', sort_order: 1, is_active: true },
  { id: 'cat-[#1D1D1F]', name: 'Bottoms & Pants', slug: 'bottoms', sort_order: 2, is_active: true },
  { id: 'cat-outerwear', name: 'Outerwear & Coats', slug: 'outerwear', sort_order: 3, is_active: true },
  { id: 'cat-dresses', name: 'Dresses & Skirts', slug: 'dresses', sort_order: 4, is_active: true },
  { id: 'cat-acc', name: 'Accessories', slug: 'accessories', sort_order: 5, is_active: true },
];

export interface MockProductData extends Product {
  category_id: string;
  category?: string; // gender: 'men', 'women', 'unisex'
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
  created_at: string;
  color_images?: {
    discount_end_date?: string;
    [key: string]: any;
  };
  product_images: ProductImage[];
  product_colors: ProductColor[];
  product_sizes: ProductSize[];
  categories: { id: string; name: string; slug: string };
}

export const INITIAL_PRODUCTS: MockProductData[] = [
  {
    id: 'prod-1',
    category_id: 'cat-bottoms',
    category: 'unisex',
    title: 'Baggy Jeans',
    slug: 'baggy-jeans',
    description: 'Har kunlik uslubingizni mukammal to\'ldiring! Ushbu premium Baggy Jeans zamonaviy dizayn, keng bichim va yuqori sifatli denim matosi bilan ajralib turadi. Yumshoq va mustahkam materiali kun davomida qulaylikni ta\'minlaydi, erkin silueti esa har qanday kombinatsiyaga mos keladi.',
    short_description: 'Zamonaviy keng bichimli premium denim jinsi shimi.',
    sku: 'ET-BGJ-001',
    price: 150.00,
    discount_price: 98.00,
    stock: 25,
    rating: 4.9,
    review_count: 18,
    is_featured: true,
    is_new: true,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    color_images: {
      discount_end_date: new Date(Date.now() + 3600000 * 24 * 3).toISOString()
    },
    product_images: [
      {
        id: 'img-1-1',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Baggy Jeans Dark Grey',
        sort_order: 0
      },
      {
        id: 'img-1-2',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Baggy Jeans Back View',
        sort_order: 1
      },
      {
        id: 'img-1-3',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Baggy Jeans Light Wash',
        sort_order: 2
      }
    ],
    product_colors: [
      {
        id: 'col-1-1',
        product_id: 'prod-1',
        color_name: 'Black',
        color_hex: '#1C1C1E',
        stock: 10,
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-1-2',
        product_id: 'prod-1',
        color_name: 'White',
        color_hex: '#F2F2F7',
        stock: 8,
        image_url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-1-3',
        product_id: 'prod-1',
        color_name: 'Pink',
        color_hex: '#FFD1DC',
        stock: 7,
        image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    product_sizes: [
      { id: 'siz-1-1', product_id: 'prod-1', size: 'L', stock: 12 },
      { id: 'siz-1-2', product_id: 'prod-1', size: 'XL', stock: 13 }
    ],
    categories: { id: 'cat-bottoms', name: 'Bottoms & Pants', slug: 'bottoms' }
  },
  {
    id: 'prod-2',
    category_id: 'cat-tops',
    category: 'unisex',
    title: 'Minimalist Cotton Futbolka',
    slug: 'minimalist-cotton-futbolka',
    description: 'Yuqori sifatli 100% organik paxtadan tayyorlangan premium futbolka. Har kungi kiyish uchun minimalist dizayn va nafas oluvchi yumshoq mato.',
    short_description: '100% Organik Paxta Premium Futbolka',
    sku: 'ET-TSH-002',
    price: 80.00,
    discount_price: 50.00,
    stock: 40,
    rating: 4.8,
    review_count: 24,
    is_featured: true,
    is_new: true,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    color_images: {
      discount_end_date: new Date(Date.now() + 3600000 * 18).toISOString()
    },
    product_images: [
      {
        id: 'img-2-1',
        product_id: 'prod-2',
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Futbolka White',
        sort_order: 0
      },
      {
        id: 'img-2-2',
        product_id: 'prod-2',
        image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Futbolka Black',
        sort_order: 1
      }
    ],
    product_colors: [
      {
        id: 'col-2-1',
        product_id: 'prod-2',
        color_name: 'White',
        color_hex: '#FFFFFF',
        stock: 20,
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-2-2',
        product_id: 'prod-2',
        color_name: 'Black',
        color_hex: '#111111',
        stock: 20,
        image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    product_sizes: [
      { id: 'siz-2-1', product_id: 'prod-2', size: 'S', stock: 10 },
      { id: 'siz-2-2', product_id: 'prod-2', size: 'M', stock: 15 },
      { id: 'siz-2-3', product_id: 'prod-2', size: 'L', stock: 15 }
    ],
    categories: { id: 'cat-tops', name: 'Tops & Shirts', slug: 'tops' }
  },
  {
    id: 'prod-3',
    category_id: 'cat-outerwear',
    category: 'men',
    title: 'Oversized Street Hoodie',
    slug: 'oversized-street-hoodie',
    description: 'Qalin va issiq saqlovchi fleece astarli premium oversayz xudi. Zamonaviy ko\'cha stili va erkin bichim.',
    short_description: 'Issiq Fleece Astarli Oversized Xudi',
    sku: 'ET-HD-003',
    price: 180.00,
    discount_price: 125.00,
    stock: 18,
    rating: 5.0,
    review_count: 31,
    is_featured: true,
    is_new: false,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    product_images: [
      {
        id: 'img-3-1',
        product_id: 'prod-3',
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Oversized Hoodie Grey',
        sort_order: 0
      },
      {
        id: 'img-3-2',
        product_id: 'prod-3',
        image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Oversized Hoodie Model',
        sort_order: 1
      }
    ],
    product_colors: [
      {
        id: 'col-3-1',
        product_id: 'prod-3',
        color_name: 'Grey Melange',
        color_hex: '#8E8E93',
        stock: 10,
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-3-2',
        product_id: 'prod-3',
        color_name: 'Charcoal',
        color_hex: '#2C2C2E',
        stock: 8,
        image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    product_sizes: [
      { id: 'siz-3-1', product_id: 'prod-3', size: 'M', stock: 8 },
      { id: 'siz-3-2', product_id: 'prod-3', size: 'L', stock: 10 }
    ],
    categories: { id: 'cat-outerwear', name: 'Outerwear & Coats', slug: 'outerwear' }
  },
  {
    id: 'prod-4',
    category_id: 'cat-outerwear',
    category: 'women',
    title: 'Tailored Wool Trench Coat',
    slug: 'tailored-wool-trench-coat',
    description: 'Nafis va klassik trench palto. Yuqori sifatli jun matosi, kamar va ikki qatli tugmalar bilan klassik uslub.',
    short_description: 'Klassik Jun Trench Palto',
    sku: 'ET-CT-004',
    price: 320.00,
    discount_price: 240.00,
    stock: 12,
    rating: 4.9,
    review_count: 15,
    is_featured: true,
    is_new: true,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    product_images: [
      {
        id: 'img-4-1',
        product_id: 'prod-4',
        image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Trench Coat Camel',
        sort_order: 0
      },
      {
        id: 'img-4-2',
        product_id: 'prod-4',
        image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Trench Coat Model',
        sort_order: 1
      }
    ],
    product_colors: [
      {
        id: 'col-4-1',
        product_id: 'prod-4',
        color_name: 'Camel',
        color_hex: '#C19A6B',
        stock: 6,
        image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-4-2',
        product_id: 'prod-4',
        color_name: 'Black',
        color_hex: '#000000',
        stock: 6,
        image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    product_sizes: [
      { id: 'siz-4-1', product_id: 'prod-4', size: 'S', stock: 4 },
      { id: 'siz-4-2', product_id: 'prod-4', size: 'M', stock: 4 },
      { id: 'siz-4-3', product_id: 'prod-4', size: 'L', stock: 4 }
    ],
    categories: { id: 'cat-outerwear', name: 'Outerwear & Coats', slug: 'outerwear' }
  },
  {
    id: 'prod-5',
    category_id: 'cat-dresses',
    category: 'women',
    title: 'Silk Satin Evening Slip Dress',
    slug: 'silk-satin-evening-slip-dress',
    description: 'Mayin ipak shoyi matodan tikilgan oqshom ko\'ylagi. Elegant kesim va nafis bel chiziqlari.',
    short_description: 'Ipak Shoyi Elegant Oqshom Ko\'ylagi',
    sku: 'ET-DRS-005',
    price: 210.00,
    discount_price: 165.00,
    stock: 15,
    rating: 4.7,
    review_count: 12,
    is_featured: false,
    is_new: true,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    product_images: [
      {
        id: 'img-5-1',
        product_id: 'prod-5',
        image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Silk Dress Champagne',
        sort_order: 0
      }
    ],
    product_colors: [
      {
        id: 'col-5-1',
        product_id: 'prod-5',
        color_name: 'Champagne',
        color_hex: '#F7E7CE',
        stock: 8,
        image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-5-2',
        product_id: 'prod-5',
        color_name: 'Emerald',
        color_hex: '#046307',
        stock: 7,
        image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    product_sizes: [
      { id: 'siz-5-1', product_id: 'prod-5', size: 'S', stock: 7 },
      { id: 'siz-5-2', product_id: 'prod-5', size: 'M', stock: 8 }
    ],
    categories: { id: 'cat-dresses', name: 'Dresses & Skirts', slug: 'dresses' }
  },
  {
    id: 'prod-6',
    category_id: 'cat-tops',
    category: 'men',
    title: 'Linen Casual Resort Shirt',
    slug: 'linen-casual-resort-shirt',
    description: 'Yozgi engil zig\'ir (linen) ko\'ylak. Harorat yuqori kunlarda salqinlik va qulaylik bag\'ishlaydi.',
    short_description: 'Yozgi Tabiiy Zig\'ir Ko\'ylak',
    sku: 'ET-SH-006',
    price: 110.00,
    discount_price: 85.00,
    stock: 22,
    rating: 4.8,
    review_count: 19,
    is_featured: false,
    is_new: false,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    product_images: [
      {
        id: 'img-6-1',
        product_id: 'prod-6',
        image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Linen Shirt Beige',
        sort_order: 0
      }
    ],
    product_colors: [
      {
        id: 'col-6-1',
        product_id: 'prod-6',
        color_name: 'Sand',
        color_hex: '#E0D5C1',
        stock: 12,
        image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'col-6-2',
        product_id: 'prod-6',
        color_name: 'Navy',
        color_hex: '#0A192F',
        stock: 10,
        image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    product_sizes: [
      { id: 'siz-6-1', product_id: 'prod-6', size: 'M', stock: 10 },
      { id: 'siz-6-2', product_id: 'prod-6', size: 'L', stock: 12 }
    ],
    categories: { id: 'cat-tops', name: 'Tops & Shirts', slug: 'tops' }
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1',
    order_number: 'ET-984021',
    customer_id: 'cust-1',
    subtotal: 196.00,
    shipping: 0,
    discount: 0,
    total: 196.00,
    payment_status: 'Completed',
    order_status: 'Completed',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    customers: {
      id: 'cust-1',
      first_name: 'Anora',
      last_name: 'Rustamova',
      email: 'anora.r@example.com',
      phone: '+998 90 123 45 67',
      address: 'Amir Temur ko\'chasi, 42-uy',
      city: 'Toshkent',
      country: 'O\'zbekiston',
      postal_code: '100000',
      notes: 'Iltimos, kechqurun yetkazib bering'
    },
    order_items: [
      {
        id: 'oi-1-1',
        order_id: 'ord-1',
        product_id: 'prod-1',
        size: 'XL',
        color: 'Black',
        quantity: 2,
        unit_price: 98.00,
        total_price: 196.00,
        products: { title: 'Baggy Jeans' }
      }
    ]
  },
  {
    id: 'ord-2',
    order_number: 'ET-382910',
    customer_id: 'cust-2',
    subtotal: 175.00,
    shipping: 0,
    discount: 0,
    total: 175.00,
    payment_status: 'Pending',
    order_status: 'Pending',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    customers: {
      id: 'cust-2',
      first_name: 'Jasur',
      last_name: 'Karimov',
      email: 'jasur.k@example.com',
      phone: '+998 93 987 65 43',
      address: 'Mustaqillik shoh ko\'chasi, 15',
      city: 'Toshkent',
      country: 'O\'zbekiston',
      postal_code: '100015',
      notes: ''
    },
    order_items: [
      {
        id: 'oi-2-1',
        order_id: 'ord-2',
        product_id: 'prod-2',
        size: 'L',
        color: 'White',
        quantity: 1,
        unit_price: 50.00,
        total_price: 50.00,
        products: { title: 'Minimalist Cotton Futbolka' }
      },
      {
        id: 'oi-2-2',
        order_id: 'ord-2',
        product_id: 'prod-2',
        size: 'M',
        color: 'Black',
        quantity: 1,
        unit_price: 50.00,
        total_price: 50.00,
        products: { title: 'Minimalist Cotton Futbolka' }
      },
      {
        id: 'oi-2-3',
        order_id: 'ord-2',
        product_id: 'prod-6',
        size: 'L',
        color: 'Sand',
        quantity: 1,
        unit_price: 75.00,
        total_price: 75.00,
        products: { title: 'Linen Casual Resort Shirt' }
      }
    ]
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    first_name: 'Anora',
    last_name: 'Rustamova',
    email: 'anora.r@example.com',
    phone: '+998 90 123 45 67',
    address: 'Amir Temur ko\'chasi, 42-uy',
    city: 'Toshkent',
    country: 'O\'zbekiston',
    postal_code: '100000',
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    orders: [INITIAL_ORDERS[0]]
  },
  {
    id: 'cust-2',
    first_name: 'Jasur',
    last_name: 'Karimov',
    email: 'jasur.k@example.com',
    phone: '+998 93 987 65 43',
    address: 'Mustaqillik shoh ko\'chasi, 15',
    city: 'Toshkent',
    country: 'O\'zbekiston',
    postal_code: '100015',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    orders: [INITIAL_ORDERS[1]]
  }
];

export const DEMO_ADMIN_PROFILE = {
  id: 'usr-admin-demo',
  email: 'admin@etomoda.com',
  full_name: 'ETOMODA Admin',
  role: 'admin',
  created_at: new Date().toISOString()
};

export const DEMO_USER_PROFILE = {
  id: 'usr-user-demo',
  email: 'user@etomoda.com',
  full_name: 'Demo Xaridor',
  role: 'user',
  created_at: new Date().toISOString()
};
