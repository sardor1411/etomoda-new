import { CartItem } from '../types';
import { mockStore } from '../data/mock/mockStore';
import { uploadToS3 } from '../services/storage';

export interface OrderData {
  orderNumber: string;
  date: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    telegram?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    notes?: string;
  };
  items: CartItem[];
  total: number;
}

export async function submitOrder(orderData: OrderData): Promise<{ success: boolean; message: string }> {
  console.log('Demo mode submitting order...', orderData);
  mockStore.createOrder(orderData);
  return { success: true, message: 'Order submitted successfully' };
}

export async function uploadMedia(file: File): Promise<string> {
  return uploadToS3(file);
}
