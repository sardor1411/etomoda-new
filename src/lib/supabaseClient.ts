import { mockStore } from '../data/mock/mockStore';

class MockQueryBuilder implements PromiseLike<any> {
  private tableName: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private filters: Array<{ type: 'eq' | 'in'; column: string; value: any }> = [];
  private orderOpts: { column: string; ascending: boolean } | null = null;
  private limitNum: number | null = null;
  private isSingle: boolean = false;
  private isMaybeSingle: boolean = false;
  private countMode: string | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns?: string, options?: { count?: string; head?: boolean }) {
    if (options?.count) {
      this.countMode = options.count;
    }
    return this;
  }

  insert(data: any | any[]) {
    this.action = 'insert';
    this.payload = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  in(column: string, value: any[]) {
    this.filters.push({ type: 'in', column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderOpts = { column, ascending: options?.ascending !== false };
    return this;
  }

  limit(num: number) {
    this.limitNum = num;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    try {
      const res = this.execute();
      return onfulfilled ? Promise.resolve(onfulfilled(res)) : (res as any);
    } catch (err) {
      if (onrejected) {
        return Promise.resolve(onrejected(err));
      }
      throw err;
    }
  }

  private execute() {
    const table = this.tableName;

    if (this.action === 'insert') {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      if (table === 'products') {
        const ids = items.map(item => mockStore.saveProductComplete(item, item.product_images || [], item.product_colors || [], item.product_sizes || []));
        const created = ids.map(id => mockStore.getProductById(id));
        return { data: this.isSingle ? created[0] : created, error: null };
      }
      if (table === 'categories') {
        const created = items.map(item => mockStore.createCategory(item.name, item.slug || item.name.toLowerCase().replace(/\s+/g, '-')));
        return { data: this.isSingle ? created[0] : created, error: null };
      }
      return { data: this.isSingle ? items[0] : items, error: null };
    }

    if (this.action === 'update') {
      if (table === 'products') {
        const eqId = this.filters.find(f => f.column === 'id')?.value;
        if (eqId) {
          mockStore.updateProductComplete(eqId, this.payload, [], [], []);
        }
        return { data: this.payload, error: null };
      }
      if (table === 'orders') {
        const eqId = this.filters.find(f => f.column === 'id')?.value;
        if (eqId && this.payload.order_status) {
          mockStore.updateOrderStatus(eqId, this.payload.order_status);
        }
        return { data: this.payload, error: null };
      }
      return { data: this.payload, error: null };
    }

    if (this.action === 'delete') {
      if (table === 'products') {
        const eqId = this.filters.find(f => f.column === 'id')?.value;
        if (eqId) {
          mockStore.deleteProduct(eqId);
        }
      }
      return { data: null, error: null };
    }

    // SELECT ACTION
    let dataset: any[] = [];
    if (table === 'products') {
      dataset = mockStore.getProducts();
    } else if (table === 'categories') {
      dataset = mockStore.getCategories();
    } else if (table === 'orders') {
      dataset = mockStore.getOrders();
    } else if (table === 'customers') {
      dataset = mockStore.getCustomers();
    } else if (table === 'profiles') {
      dataset = mockStore.getProfiles();
    } else {
      dataset = [];
    }

    // Apply Filters
    let result = dataset.filter(item => {
      for (const filter of this.filters) {
        if (filter.type === 'eq') {
          // Handle nested category.slug or categories.slug
          if (filter.column === 'categories.slug' || filter.column === 'category.slug') {
            const val = item.categories?.slug || item.category?.slug;
            if (val !== filter.value) return false;
          } else if (filter.column === 'category') {
            if (item.category !== filter.value) return false;
          } else {
            const val = item[filter.column];
            if (val !== undefined && val !== filter.value) return false;
          }
        } else if (filter.type === 'in') {
          if (filter.column === 'category') {
            if (!filter.value.includes(item.category)) return false;
          } else {
            const val = item[filter.column];
            if (!filter.value.includes(val)) return false;
          }
        }
      }
      return true;
    });

    // Apply Ordering
    if (this.orderOpts) {
      const { column, ascending } = this.orderOpts;
      result.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        if (column === 'created_at') {
          valA = new Date(valA || 0).getTime();
          valB = new Date(valB || 0).getTime();
        }
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });
    }

    // Apply Limit
    if (this.limitNum !== null && this.limitNum > 0) {
      result = result.slice(0, this.limitNum);
    }

    const count = result.length;

    if (this.isSingle) {
      const singleItem = result[0] || null;
      return { data: singleItem, error: singleItem ? null : new Error('Record not found'), count };
    }

    if (this.isMaybeSingle) {
      return { data: result[0] || null, error: null, count };
    }

    return { data: result, error: null, count };
  }
}

// Global Auth state change listeners
const authListeners: Array<(event: string, session: any) => void> = [];

export const supabase = {
  from: (table: string) => {
    return new MockQueryBuilder(table);
  },
  auth: {
    async getSession() {
      const session = mockStore.getAuthSession();
      return { data: { session }, error: null };
    },
    async getUser(token?: string) {
      const session = mockStore.getAuthSession();
      return { data: { user: session?.user || null }, error: null };
    },
    async signInWithPassword({ email }: { email: string; password?: string }) {
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const session = {
        access_token: 'demo-token-' + Date.now(),
        user: {
          id: role === 'admin' ? 'usr-admin-demo' : 'usr-user-demo',
          email: email,
          user_metadata: {
            full_name: role === 'admin' ? 'ETOMODA Admin' : 'Demo User',
            role: role
          }
        }
      };
      mockStore.setAuthSession(session);
      authListeners.forEach(fn => fn('SIGNED_IN', session));
      return { data: { user: session.user, session }, error: null };
    },
    async signOut() {
      mockStore.clearAuthSession();
      authListeners.forEach(fn => fn('SIGNED_OUT', null));
      return { error: null };
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      authListeners.push(callback);
      const session = mockStore.getAuthSession();
      // Instantly invoke with current session
      callback('INITIAL_SESSION', session);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = authListeners.indexOf(callback);
              if (idx !== -1) authListeners.splice(idx, 1);
            }
          }
        }
      };
    },
    admin: {
      async createUser({ email, user_metadata }: any) {
        const user = {
          id: `usr-${Date.now()}`,
          email,
          user_metadata: user_metadata || { full_name: 'New User', role: 'user' }
        };
        return { data: { user }, error: null };
      }
    }
  }
};
