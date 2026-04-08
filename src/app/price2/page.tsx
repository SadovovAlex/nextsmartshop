"use client";

import React, { useState, useEffect } from "react";
import PriceListGrouped from "@/components/PriceListGrouped";
import Container from "@/components/Container";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";

const PricePage2 = () => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Group products by first word of title
  const groups = new Map<string, ProductsStruct[]>();
  
  products.forEach(product => {
    const firstWord = product.title.split(' ')[0].toLowerCase();
    if (!groups.has(firstWord)) {
      groups.set(firstWord, []);
    }
    groups.get(firstWord)!.push(product);
  });

  const groupedProducts: Array<{
    groupName: string;
    products: ProductsStruct[];
    totalSum: number;
    firstImage: string;
  }> = [];

  groups.forEach((productList, groupName) => {
    const firstProduct = productList[0];
    const totalSum = productList.reduce((sum, product) => sum + product.price, 0);
    groupedProducts.push({
      groupName,
      products: productList,
      totalSum,
      firstImage: firstProduct.image || "default.png",
    });
  });

  return (
    <div id="price2-page" className="min-h-screen">
      <Container>
      <PriceListGrouped groupedProducts={groupedProducts} searchTerm={""} />
      </Container>
    </div>
  );
};

export default PricePage2;