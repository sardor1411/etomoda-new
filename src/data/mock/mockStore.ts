import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  DEMO_ADMIN_PROFILE,
  DEMO_USER_PROFILE,
  MockProductData 
} from './mockData';
import { Category } from '../../services/categories';
import { OrderData } from '../../lib/api';

const DB_KEY = 'etomoda_demo_db_v1';
const AUTH_KEY = 'etomoda_demo_auth_v1';

interface DBState {
  products: MockProductData[];
  categories: Category[];
  orders: any[];
  customers: any[];
  profiles: any[];
}

function loadDB(): DBState {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load local demo database:', e);
  }

  const initial: DBState = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    orders: INITIAL_ORDERS,
    customers: INITIAL_CUSTOMERS,
    profiles: [DEMO_ADMIN_PROFILE, DEMO_USER_PROFILE]
  };

  saveDB(initial);
  return initial;
}

function saveDB(db: DBState) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Failed to save local demo database:', e);
  }
}

let db: DBState = loadDB();

export const mockStore = {
  getProducts(): MockProductData[] {
    return [...db.products];
  },

  getProductById(id: string): MockProductData | undefined {
    return db.products.find(p => p.id === id);
  },

  getCategories(): Category[] {
    return [...db.categories];
  },

  createCategory(name: string, slug: string): Category {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      sort_order: db.categories.length + 1,
      is_active: true
    };
    db.categories.push(newCat);
    saveDB(db);
    return newCat;
  },

  saveProductComplete(
    productData: any,
    images: any[],
    colors: any[],
    sizes: any[]
  ): string {
    const category = db.categories.find(c => c.id === productData.category_id) || {
      id: productData.category_id,
      name: 'General',
      slug: 'general'
    };

    const newId = `prod-${Date.now()}`;
    const formattedImages = (images || []).map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      product_id: newId,
      image_url: img.image_url || img,
      alt_text: img.alt_text || productData.title,
      sort_order: idx
    }));

    const formattedColors = (colors || []).map((c, idx) => ({
      id: `col-${Date.now()}-${idx}`,
      product_id: newId,
      color_name: c.color_name,
      color_hex: c.color_hex || '#000000',
      stock: c.stock || 0,
      image_url: c.image_url
    }));

    const formattedSizes = (sizes || []).map((s, idx) => ({
      id: `siz-${Date.now()}-${idx}`,
      product_id: newId,
      size: s.size,
      stock: s.stock || 0
    }));

    const newProd: MockProductData = {
      ...productData,
      id: newId,
      stock: productData.stock || 10,
      rating: productData.rating || 5.0,
      review_count: productData.review_count || 1,
      is_featured: !!productData.is_featured,
      is_new: !!productData.is_new,
      is_active: productData.is_active !== false,
      created_at: new Date().toISOString(),
      product_images: formattedImages,
      product_colors: formattedColors,
      product_sizes: formattedSizes,
      categories: { id: category.id, name: category.name, slug: category.slug }
    };

    db.products.unshift(newProd);
    saveDB(db);
    return newId;
  },

  updateProductComplete(
    productId: string,
    productData: any,
    images: any[],
    colors: any[],
    sizes: any[]
  ) {
    const index = db.products.findIndex(p => p.id === productId);
    if (index === -1) return;

    const existing = db.products[index];
    const category = db.categories.find(c => c.id === (productData.category_id || existing.category_id)) || existing.categories;

    const formattedImages = (images || []).map((img, idx) => ({
      id: img.id || `img-${Date.now()}-${idx}`,
      product_id: productId,
      image_url: img.image_url || img,
      alt_text: img.alt_text || productData.title || existing.title,
      sort_order: idx
    }));

    const formattedColors = (colors || []).map((c, idx) => ({
      id: c.id || `col-${Date.now()}-${idx}`,
      product_id: productId,
      color_name: c.color_name,
      color_hex: c.color_hex || '#000000',
      stock: c.stock || 0,
      image_url: c.image_url
    }));

    const formattedSizes = (sizes || []).map((s, idx) => ({
      id: s.id || `siz-${Date.now()}-${idx}`,
      product_id: productId,
      size: s.size,
      stock: s.stock || 0
    }));

    db.products[index] = {
      ...existing,
      ...productData,
      categories: { id: category.id, name: category.name, slug: category.slug },
      product_images: formattedImages.length > 0 ? formattedImages : existing.product_images,
      product_colors: formattedColors.length > 0 ? formattedColors : existing.product_colors,
      product_sizes: formattedSizes.length > 0 ? formattedSizes : existing.product_sizes,
      updated_at: new Date().toISOString()
    };

    saveDB(db);
  },

  deleteProduct(productId: string) {
    db.products = db.products.filter(p => p.id !== productId);
    saveDB(db);
  },

  getOrders(): any[] {
    return [...db.orders];
  },

  createOrder(orderData: OrderData): any {
    let customer = db.customers.find(c => c.email === orderData.customer.email || c.phone === orderData.customer.phone);
    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        address: orderData.customer.address,
        city: orderData.customer.city,
        country: orderData.customer.country,
        postal_code: orderData.customer.postalCode,
        created_at: new Date().toISOString(),
        orders: []
      };
      db.customers.unshift(customer);
    }

    const orderId = `ord-${Date.now()}`;
    const newOrder = {
      id: orderId,
      order_number: orderData.orderNumber || `ET-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: customer.id,
      subtotal: orderData.total,
      shipping: 0,
      discount: 0,
      total: orderData.total,
      payment_status: 'Pending',
      order_status: 'Pending',
      created_at: orderData.date || new Date().toISOString(),
      customers: customer,
      order_items: orderData.items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        order_id: orderId,
        product_id: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        products: { title: item.title }
      }))
    };

    db.orders.unshift(newOrder);
    if (!customer.orders) customer.orders = [];
    customer.orders.unshift(newOrder);

    saveDB(db);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: string) {
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.order_status = status;
      if (status === 'Completed') order.payment_status = 'Completed';
      saveDB(db);
    }
  },

  getCustomers(): any[] {
    return [...db.customers];
  },

  getProfiles(): any[] {
    return [...db.profiles];
  },

  getProfileById(id: string): any {
    return db.profiles.find(p => p.id === id) || (id.includes('admin') ? DEMO_ADMIN_PROFILE : DEMO_USER_PROFILE);
  },

  // Auth local session
  getAuthSession(): any {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default to admin session so user can freely preview admin panel without friction
    const defaultSession = {
      access_token: 'demo-access-token-123',
      user: {
        id: DEMO_ADMIN_PROFILE.id,
        email: DEMO_ADMIN_PROFILE.email,
        user_metadata: { full_name: DEMO_ADMIN_PROFILE.full_name, role: 'admin' }
      }
    };
    this.setAuthSession(defaultSession);
    return defaultSession;
  },

  setAuthSession(session: any) {
    try {
      if (session) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {}
  },

  clearAuthSession() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  }
};
