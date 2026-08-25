import { supabase } from '../lib/supabaseClient';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error('Error checking slug uniqueness: ' + error.message);
    }

    if (!data) {
      isUnique = true;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
}

export async function createCategory(name: string): Promise<Category> {
  const baseSlug = generateSlug(name);
  const slug = await generateUniqueSlug(baseSlug);

  const { data, error } = await supabase
    .from('categories')
    .insert([{ 
      name,
      slug,
      description: "",
      image_url: null,
      sort_order: 0,
      is_active: true
    }])
    .select('id, name, slug')
    .single();

  if (error) {
    throw new Error('Failed to create category: ' + error.message);
  }

  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error('Failed to load categories: ' + error.message);
  }

  return data;
}
