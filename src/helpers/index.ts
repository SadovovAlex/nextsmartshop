import { productData } from "@/constants/data";

export const getProducts = async () => {
  return productData
}

export const getTrendingProducts = async () => {
  return productData
}
/*
export const getProducts = async () => {
  const res = await fetch("https://fakestoreapiserver.reactbd.com/smart");
  if (!res.ok) {
    throw new Error("Faild to fetch products");
  }
  return res.json();
};
export const getTrendingProducts = async () => {
  const res = await fetch(
    "https://fakestoreapiserver.reactbd.com/smarttrending333"
  );
  if (!res.ok) {
    throw new Error("Faild to fetch products");
  }
  return res.json();
};

*/

export const calculatePercentage = (oldPrice: any, price: any) => {
  return !!parseFloat(price) && !!parseFloat(oldPrice)
    ? (100 - ( price / oldPrice) * 100).toFixed(0)
    : "0";
};

export const getSingleProduct = (_id: number) => {
  const item = productData.find((product) => product._id === _id);
  return item;
};
