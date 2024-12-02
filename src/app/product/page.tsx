import Container from "@/components/Container";
import { getSingleProudct, getTrendingProducts } from "@/helpers";
import { Products } from "../../../type";
import ProductsData from "@/components/ProductsData";
import SignleProduct from "@/components/SignleProduct";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const ProuctPage = async ({ searchParams }: Props) => {
  const _id = Number(searchParams?._id);
  const [product, data] = await Promise.all([
    getSingleProudct(_id),
    getTrendingProducts(),
  ]);

  return (
    <div>
      <Container>
        <SignleProduct product={product} />
        <div>
          <p className="text-xl py-1 font-semibold">У нас еще есть</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {data?.map((item) => <ProductsData key={item._id} item={item} />)}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProuctPage;
