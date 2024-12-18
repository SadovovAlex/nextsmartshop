export interface ProductsStruct {
  _id: number;
  title: string;
  isNew: number;
  oldPrice: number;
  price: number;
  type: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  quantity: number;
  ingredients: string,
}

export interface ItemProps {
  item: ProductsStruct;
}

export interface StateProps {
  shopping: {
    productData: [];
    userInfo: {};
    orderData: {
      order: ProductsStruct[];
    };
  };
}
