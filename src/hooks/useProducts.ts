import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  ingredients: string[] | null;
  benefits: string[] | null;
  how_to_use: string | null;
  expected_results: string | null;
  in_stock: boolean | null;
  featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DBProductImage {
  id: string;
  product_id: string;
  image_url: string;
  position: number | null;
}

export interface ProductWithImages extends DBProduct {
  images: DBProductImage[];
}

// Fetch all products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch images for all products
      const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('position', { ascending: true });

      if (imagesError) throw imagesError;

      // Combine products with their images
      const productsWithImages: ProductWithImages[] = (products || []).map(product => ({
        ...product,
        images: (images || []).filter(img => img.product_id === product.id)
      }));

      return productsWithImages;
    }
  });
};

// Fetch single product by slug
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!product) return null;

      // Fetch images for this product
      const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position', { ascending: true });

      if (imagesError) throw imagesError;

      return {
        ...product,
        images: images || []
      } as ProductWithImages;
    },
    enabled: !!slug
  });
};

// Fetch featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('position', { ascending: true });

      if (imagesError) throw imagesError;

      const productsWithImages: ProductWithImages[] = (products || []).map(product => ({
        ...product,
        images: (images || []).filter(img => img.product_id === product.id)
      }));

      return productsWithImages;
    }
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DBProduct> }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<DBProduct, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Upload product image
export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, file }: { productId: string; file: File }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Get current max position
      const { data: existingImages } = await supabase
        .from('product_images')
        .select('position')
        .eq('product_id', productId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = existingImages && existingImages.length > 0 
        ? (existingImages[0].position || 0) + 1 
        : 0;

      // Save to database
      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          position: nextPosition
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Delete product image
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      // Extract file path from URL
      const urlParts = imageUrl.split('/product-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('product-images').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
