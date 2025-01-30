import Container from "@/components/Container";
import { getSingleProduct, getTrendingProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";
import ProductsData from "@/components/ProductsData";
import SignleProduct from "@/components/SingleProduct";
import Menu from "@/components/Menu";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ProductPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const _idString = searchParams?._id;
  const _id = Number(_idString);

  let data: ProductsStruct[] | null = null;
  let error: Error | null = null;

  try {
    // Получаем данные асинхронно
    data = await getTrendingProducts();
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
    error = err as Error;
  }

  return (
    <div>
      {/* Меню и контейнер вынесены из блока try */}
      <Menu />
      <Container>
      <SignleProduct productId={_id} />
        {error ? (
          // Если произошла ошибка, показываем сообщение
          <p>Тренды не получены, попробуйте позже.</p>
        ) : (
          // Если ошибки нет, рендерим основной контент
          <>    
            <div>
              <p className="text-xl py-1 font-semibold">У нас еще есть</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {data?.map((item: ProductsStruct) => (
                  <ProductsData key={item._id} item={item} />
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductPage;