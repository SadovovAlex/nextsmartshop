import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import ProductsData from "./ProductsData";
import { ProductsStruct } from "../../type";

interface ProductsProps {
  searchTerm: string; // Указываем тип для searchTerm
}

const Products: React.FC<ProductsProps> = ({ searchTerm }) => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  // Фильтрация продуктов на основе searchTerm
  const filteredProducts = products.filter((item) => {
    const isMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Логирование фильтрации
    //console.log(`Filtering product: ${item.title}, filter '${searchTerm.toLowerCase()}', Match: ${isMatch}`);
    
    return isMatch;
  });

  // Логирование общего количества отфильтрованных продуктов
  //console.log(`Total filtered products: ${filteredProducts.length}`);

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 -mt-10">
      {filteredProducts.map((item: ProductsStruct) => (
        <ProductsData item={item} key={item._id} />
      ))}
    </Container>
  );
};

export default Products;
