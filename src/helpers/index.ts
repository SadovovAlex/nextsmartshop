import { productData } from "@/constants/data";

/*
export const getProducts = async () => {
  return productData
} 

export const getTrendingProducts = async () => {
  return productData
}
  */

export const getProducts = async () => {
  const res = await fetch("http://localhost:3001/api/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await res.json(); // Дождитесь завершения промиса
  //console.log(products.slice(0, 3)); // Выводим первые три элемента в консоль
  return products; // Возвращаем все продукты
};



export const getTrendingProducts = async () => {
  const res = await fetch(
    "http://localhost:3001/api/trendproducts"
  );
  if (!res.ok) {
    throw new Error("Faild to fetch products");
  }
  return res.json();
};


export const calculatePercentage = (oldPrice: any, price: any) => {
  return !!parseFloat(price) && !!parseFloat(oldPrice)
    ? (100 - ( price / oldPrice) * 100).toFixed(0)
    : "0";
};

/*
из локального файла
export const getSingleProduct2 = (_id: number) => {
  const item = productData.find((product) => product._id === _id);
  console.log(item);
  return item;
};
*/

export const getSingleProduct = async (_id: number) => {
  const res = await fetch(`http://localhost:3001/api/products/${_id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  // Дожидаемся завершения промиса и получаем данные
  const product = await res.json();
  //console.log('xxxxx=', product); // Теперь выводим результат в консоль

  // Возвращаем продукт в формате JSON
  return product;
};
