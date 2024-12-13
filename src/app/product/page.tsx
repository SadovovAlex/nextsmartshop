import Container from "@/components/Container";
import { getSingleProduct, getTrendingProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";
import ProductsData from "@/components/ProductsData";
import SignleProduct from "@/components/SingleProduct";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ProuctPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const _idString = searchParams?._id;
  const _id = Number(_idString);
  const product = getSingleProduct(_id);
  const data = await getTrendingProducts();

  return (
    <div>
      <Container>
         {/* Кнопка "Назад" */}
         <div className="mb-4">
            <Link href={"/"}>
              <button className="bg-darkText text-white py-2 px-6 rounded-md hover:bg-orange-600 duration-200">
                На главную
              </button>
            </Link>
          </div>
        <SignleProduct product={product} />
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
};

export default ProuctPage;
