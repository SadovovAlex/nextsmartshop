// app/product/page.tsx
import Container from "@/components/Container";
import { getSingleProduct, getTrendingProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";
import ProductsData from "@/components/ProductsData";
import SignleProduct from "@/components/SingleProduct";
import Menu from "@/components/Menu";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ProductPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const _idString = searchParams?._id;
  const _id = Number(_idString);

  // Получаем трендовые продукты
  const trendingProducts = await getTrendingProducts();

  return (
    <div>
      <Menu />
      <Container>
        <Suspense fallback={<div className="py-10 text-center">Загрузка товара...</div>}>
          <SignleProduct productId={_id} />
        </Suspense>
        
        {/* Секция "У нас еще есть" */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            У нас еще есть
          </h2>
          
          {trendingProducts && trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingProducts.map((item: ProductsStruct) => (
                <ProductsData key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">
              Трендовые товары временно недоступны
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;