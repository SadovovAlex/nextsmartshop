import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import ProductsDataOpt from "./ProductsDataOpt";
import { ProductsStruct } from "../../type";

const ProductsOpt: React.FC = () => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Товары не найдены
        </div>
      )}
      
      {!loading && !error && products.length > 0 && (
        <div className="products-opt-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((item: ProductsStruct) => (
            <ProductsDataOpt item={item} key={item._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsOpt;