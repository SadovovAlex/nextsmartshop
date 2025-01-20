
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
 

  try {
    // Получаем продукт асинхронно
    //const product = await getSingleProduct(_id);
    const data = await getTrendingProducts();
    return (
      <div>
        <Menu />
        <Container>
        <SignleProduct productId={_id} />
        
          <div>
            <p className="text-xl py-1 font-semibold">У нас еще есть</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {data?.map((item: ProductsStruct) => (
                <ProductsData key={item._id} item={item} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );

  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return (
      <div>
        <Container>
          <p>Произошла ошибка при получении данных. Пожалуйста, попробуйте позже.</p>
        </Container>
      </div>
    );
  }
};


export default ProductPage;

