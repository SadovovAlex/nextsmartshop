// type.ts - Полное определение ProductsStruct с новыми полями
export interface ProductsStruct {
  _id: number;
  title: string;
  isNew: number;
  oldPrice: number;
  price: number;
  type: string;
  description: string;
  cat_name: string;
  image: string;
  rating: number;
  quantity: number;
  ingredients: string;
  hide?: number;          // 0 - показан, 1 - скрыт (NULL в БД = показан)
  category_id?: number;   // ID категории для связи с dict_category
  cat_priority?: number;  // Приоритет сортировки категорий
}

export interface ItemProps {
  item: ProductsStruct;
}

export interface StateProps {
  shopping: {
    productData: ProductsStruct[]; // Исправлено: [] -> ProductsStruct[]
    userInfo: {};
    orderData: {
      order: ProductsStruct[];
      id?: string;
    };
  };
}