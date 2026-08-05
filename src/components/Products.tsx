// Products.tsx - Улучшенная версия с поддержкой hide и админ-режима
import { getProducts } from "@/helpers";
import React, { useEffect, useState, useMemo } from "react";
import Container from "./Container";
import ProductsData from "./ProductsData";
import { ProductsStruct } from "../../type";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface ProductsProps {
  searchTerm: string;
  categories?: string[];
}

const Products: React.FC<ProductsProps> = ({ searchTerm, categories = [] }) => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { admin } = useAdminAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await getProducts();
        
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          setError('Неверный формат данных');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация продуктов (скрытые показываем только админам)
  const visibleProducts = useMemo(() => {
    if (admin) {
      return products;
    }
    return products.filter(product => product.hide !== 1);
  }, [products, admin]);

  // Группировка продуктов по категориям
  const groupedByCategory = useMemo(() => {
    const groups: { [key: string]: ProductsStruct[] } = {};
    visibleProducts.forEach(product => {
      const cat = product.cat_name || 'Другое';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return groups;
  }, [visibleProducts]);

  // Фильтрация по поиску
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return visibleProducts;
    
    const searchLower = searchTerm.toLowerCase();
    return visibleProducts.filter((item) => {
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.cat_name?.toLowerCase().includes(searchLower) ||
        item.type?.toLowerCase().includes(searchLower) ||
        item.ingredients?.toLowerCase().includes(searchLower)
      );
    });
  }, [visibleProducts, searchTerm]);

  // Группировка отфильтрованных продуктов
  const filteredGrouped = useMemo(() => {
    const groups: { [key: string]: ProductsStruct[] } = {};
    filteredProducts.forEach(product => {
      const cat = product.cat_name || 'Другое';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return groups;
  }, [filteredProducts]);

  // Проверяем, есть ли скрытые товары (для админа)
  const hasHiddenProducts = useMemo(() => {
    if (!admin) return false;
    return products.some(p => p.hide === 1);
  }, [products, admin]);

  if (loading) {
    return (
      <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 -mt-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
            <div className="w-full h-64 bg-gray-200 rounded-xl" />
            <div className="mt-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-red-600">⚠️ {error}</h3>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </Container>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-600">😕 Ничего не найдено</h3>
          <p className="text-gray-400 mt-2">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Товары временно отсутствуют'}
          </p>
        </div>
      </Container>
    );
  }

  // Если есть категории и нет поиска - показываем сгруппированно
  if (categories.length > 0 && !searchTerm) {
    return (
      <Container className="space-y-8 -mt-10">
        {/* Информация для админа о скрытых товарах */}
        {admin && hasHiddenProducts && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700 flex items-center gap-2">
            <span className="text-lg">👀</span>
            <span>
              Вы видите все товары, включая скрытые. 
              Скрытые товары отмечены значком 
              <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                Скрыт
              </span>
            </span>
          </div>
        )}

        {Object.entries(filteredGrouped).map(([category, items]) => {
          const allHidden = items.every(item => item.hide === 1);
          const hasHidden = items.some(item => item.hide === 1);
          
          return (
            <div key={category} id={`category-${category}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 w-1 h-8 rounded-full" />
                {category}
                <span className="text-sm font-normal text-gray-400">
                  ({items.length})
                </span>
                {admin && hasHidden && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {allHidden ? 'Все скрыты' : 'Есть скрытые'}
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      {item.hide === 1 && admin ? (
                        // Скрытый товар - затемненная карточка с оверлеем
                        <div className="relative">
                          {/* Полупрозрачный серый оверлей */}
                          <div className="absolute inset-0 bg-gray-400/50 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
                            <span className="bg-gray-700/80 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Скрыт
                            </span>
                          </div>
                          <div className="opacity-40 grayscale-[0.3]">
                            <ProductsData item={item} />
                          </div>
                        </div>
                      ) : (
                        <ProductsData item={item} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </Container>
    );
  }

  // Без категорий или с поиском - обычный список
  return (
    <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 -mt-10">
      {admin && hasHiddenProducts && (
        <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-2 text-xs text-yellow-700 text-center">
          👀 Режим администратора: видны все товары
        </div>
      )}
      
      <AnimatePresence>
        {filteredProducts.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut"
            }}
          >
            {item.hide === 1 && admin ? (
              // Скрытый товар - затемненная карточка с оверлеем
              <div className="relative">
                {/* Полупрозрачный серый оверлей */}
                <div className="absolute inset-0 bg-gray-400/50 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
                  <span className="bg-gray-700/80 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Скрыт
                  </span>
                </div>
                <div className="opacity-40 grayscale-[0.3]">
                  <ProductsData item={item} />
                </div>
              </div>
            ) : (
              <ProductsData item={item} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </Container>
  );
};

export default Products;