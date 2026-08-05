// src/helpers/index.ts
import { ProductsStruct } from '../../type';

// ===== ПОЛУЧЕНИЕ URL API =====
const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  // Убираем /api из конца если есть, чтобы не было двойного /api
  return baseUrl.replace(/\/api$/, '');
};

// ===== ПОЛУЧЕНИЕ ВСЕХ ТОВАРОВ =====
export const getProducts = async (): Promise<ProductsStruct[]> => {
  try {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/api/products`;
    
    // Передаем токен если есть
    const token = localStorage.getItem('adminToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const products = await response.json();
    
    if (!Array.isArray(products)) {
      console.error('Products data is not an array:', products);
      return [];
    }
    
    return products.map((product: any) => ({
      _id: product._id || product.id || 0,
      title: product.title || 'Без названия',
      isNew: Number(product.isNew) || 0,
      oldPrice: Number(product.oldPrice) || 0,
      price: Number(product.price) || 0,
      type: product.type || '',
      description: product.description || '',
      cat_name: product.cat_name || '',
      image: product.image || '/static/no_photo.webp',
      rating: Number(product.rating) || 0,
      quantity: Number(product.quantity) || 0,
      ingredients: product.ingredients || '',
      hide: product.hide || 0,
      category_id: product.category_id || 0,
      cat_priority: product.cat_priority || 0,
    }));
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
};

// ===== ПОЛУЧЕНИЕ ТРЕНДОВЫХ ТОВАРОВ =====
export const getTrendingProducts = async (): Promise<ProductsStruct[]> => {
  try {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/api/trendproducts`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending products: ${response.status}`);
    }
    
    const products = await response.json();
    
    if (!Array.isArray(products)) {
      console.error('Trending products data is not an array:', products);
      return [];
    }
    
    return products.map((product: any) => ({
      _id: product._id || product.id || 0,
      title: product.title || 'Без названия',
      isNew: Number(product.isNew) || 0,
      oldPrice: Number(product.oldPrice) || 0,
      price: Number(product.price) || 0,
      type: product.type || '',
      description: product.description || '',
      cat_name: product.cat_name || '',
      image: product.image || '/static/no_photo.webp',
      rating: Number(product.rating) || 0,
      quantity: Number(product.quantity) || 0,
      ingredients: product.ingredients || '',
      hide: product.hide || 0,
      category_id: product.category_id || 0,
      cat_priority: product.cat_priority || 0,
    }));
  } catch (error) {
    console.error('Error in getTrendingProducts:', error);
    return [];
  }
};

// ===== ПОЛУЧЕНИЕ ОДНОГО ТОВАРА =====
export const getSingleProduct = async (_id: number): Promise<ProductsStruct | null> => {
  try {
    if (!_id || isNaN(Number(_id))) {
      throw new Error('Invalid product ID');
    }
    
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/api/products/${_id}`;
    
    // Передаем токен если есть
    const token = localStorage.getItem('adminToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const product = await response.json();
    
    if (!product || typeof product !== 'object') {
      throw new Error('Invalid product data');
    }
    
    return {
      _id: product._id || product.id || 0,
      title: product.title || 'Без названия',
      isNew: Number(product.isNew) || 0,
      oldPrice: Number(product.oldPrice) || 0,
      price: Number(product.price) || 0,
      type: product.type || '',
      description: product.description || '',
      cat_name: product.cat_name || '',
      image: product.image || '/static/no_photo.webp',
      rating: Number(product.rating) || 0,
      quantity: Number(product.quantity) || 0,
      ingredients: product.ingredients || '',
      hide: product.hide || 0,
      category_id: product.category_id || 0,
      cat_priority: product.cat_priority || 0,
    };
  } catch (error) {
    console.error('Error in getSingleProduct:', error);
    return null;
  }
};

// ===== РАСЧЕТ СКИДКИ =====
export const calculatePercentage = (oldPrice: any, price: any): string => {
  const old = Number(oldPrice);
  const curr = Number(price);
  
  if (old <= 0 || curr <= 0 || old <= curr) {
    return "0";
  }
  
  return ((100 - (curr / old) * 100)).toFixed(0);
};

// ===== ОБНОВЛЕНИЕ ТОВАРА (админ) =====
export const updateProduct = async (id: number, data: any): Promise<any> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Необходима авторизация');
    }
    
    const baseUrl = getApiUrl();
    // Здесь используем /api/admin/... (без двойного /api)
    const url = `${baseUrl}/api/admin/products/${id}`;
    console.log('📤 Updating product at:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка обновления');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// ===== УДАЛЕНИЕ ТОВАРА (админ) =====
export const deleteProduct = async (id: number): Promise<any> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Необходима авторизация');
    }
    
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/api/admin/products/${id}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка удаления');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ===== ПЕРЕКЛЮЧЕНИЕ ВИДИМОСТИ ТОВАРА (админ) =====
export const toggleProductVisibility = async (id: number, hide: number): Promise<any> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Необходима авторизация');
    }
    
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/products/${id}/hide`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ hide }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка изменения видимости');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling visibility:', error);
    throw error;
  }
};

// ===== ПОЛУЧЕНИЕ КАТЕГОРИЙ =====
export const getCategories = async (): Promise<any[]> => {
  try {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/categories`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
};