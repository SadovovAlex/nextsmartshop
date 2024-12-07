import Container from "@/components/Container";
import { getSingleProduct, getTrendingProducts } from "@/helpers";
import { Products } from "../../../type";
import ProductsData from "@/components/ProductsData";
import SignleProduct from "@/components/SingleProduct";

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
        <SignleProduct product={product} />
        <div>
          <p className="text-xl py-1 font-semibold">У нас еще есть</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {data?.map((item: Products) => (
              <ProductsData key={item._id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProuctPage;
