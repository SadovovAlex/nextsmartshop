import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductsStruct } from "../../type";
import Link from "next/link";

interface ProductsProps {
  searchTerm: string;
}

const PriceList: React.FC<ProductsProps> = ({ searchTerm }) => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  // Фильтрация продуктов на основе searchTerm
  const filteredProducts = products.filter((item) => {
    const isMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isMatch;
  });

  // Сортировка продуктов
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortColumn === "title") {
      return sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortColumn === "type") {
      return sortDirection === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    } else if (sortColumn === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortColumn === "cat_name") {
      return sortDirection === "asc"
        ? a.cat_name.localeCompare(b.cat_name, "ru")
        : b.cat_name.localeCompare(a.cat_name, "ru");
    } else if (sortColumn === "id") {
      return sortDirection === "asc" ? a._id - b._id : b._id - a._id;
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th
            className="px-2 py-1 cursor-pointer hover:bg-gray-300"
            onClick={() => handleSort("id")}
          >
            #
          </th>

          <th className="px-2 py-1"></th>
          <th
            className="px-2 py-1 cursor-pointer hover:bg-gray-300"
            onClick={() => handleSort("title")}
          >
            Наименование
          </th>


          <th className="px-2 py-1 cursor-pointer hover:bg-gray-300"
            onClick={() => handleSort("cat_name")}
          >
            Категория
          </th>
          <th
            className="px-2 py-1 cursor-pointer hover:bg-gray-300"
            onClick={() => handleSort("type")}
          >
            Ед.изм.
          </th>
          <th
            className="px-2 py-1 cursor-pointer hover:bg-gray-300"
            onClick={() => handleSort("price")}
          >
            Цена,₽
          </th>
        </tr>
      </thead>
      <tbody className="text-xs">
        {sortedProducts.map((item: ProductsStruct, index) => (
          <tr
            key={item._id}
            className={`border-b hover:bg-green-100 transition-colors duration-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
          >
            <td className="px-1 py-1">
              <Link
                href={{
                  pathname: "/product",
                  query: { _id: item?._id },
                }}
              >
                {item?._id}
              </Link>

            </td>
            <td className="px-1 py-1">
              <Link
                href={{
                  pathname: "/product",
                  query: { _id: item?._id },
                }}
              >
                <Image
                  src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
                  alt="product image"
                  width={25}
                  height={25}
                />
              </Link>

            </td>
            <td className="px-2 py-1">
              <Link
                href={{
                  pathname: "/product",
                  query: { _id: item?._id },
                }}
              >
                {item.title}
              </Link>
            </td>
            <td className="px-2 py-1">{item?.cat_name}</td>
            <td className="px-2 py-1">{item?.type}</td>
            <td className="px-2 py-1">{item?.price}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
};

export default PriceList;
