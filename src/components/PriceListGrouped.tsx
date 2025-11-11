import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import { ProductsStruct } from "../../type";
import Link from "next/link";

interface ProductsProps {
  searchTerm: string;
}

// Group interface for products with same price and category
interface ProductGroup {
  id: string;
  category: string;
  unit: string;
  price: number;
  baseName: string;
  variations: {
    id: number;
    title: string;
    fullTitle: string;
    image?: string;
  }[];
}

const PriceListGrouped: React.FC<ProductsProps> = ({ searchTerm }) => {
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

  // Группировка продуктов по категории, цене и единице измерения
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    // Создаем ключ для группировки: category_price_unit
    const key = `${product.cat_name}_${product.price}_${product.type}`;

    if (!groups[key]) {
      groups[key] = {
        id: key,
        category: product.cat_name,
        unit: product.type,
        price: product.price,
        baseName: "", // будет установлено из первого продукта
        variations: []
      };
    }

    // Устанавливаем базовое имя из первого продукта в группе
    if (!groups[key].baseName) {
      groups[key].baseName = product.title;
    }

    // Извлекаем вариацию из названия (вишня, изюм, ориг. и т.д.)
    const title = product.title;
    let variation = "ориг."; // значение по умолчанию

    // Пытаемся найти вариацию в названии
    if (title.includes('вишн')) {
      variation = "вишня";
    } else if (title.includes('изюм')) {
      variation = "изюм";
    } else if (title.includes('клубник')) {
      variation = "клубника";
    } else if (title.includes('малин')) {
      variation = "малина";
    } else if (title.includes('черник')) {
      variation = "черника";
    } else if (title.includes('сгущенк')) {
      variation = "сгущенка";
    } else if (title.includes('варень')) {
      variation = "варенье";
    } else if (title.includes('мед')) {
      variation = "мед";
    } else if (title.includes('орех')) {
      variation = "орехи";
    } else if (title.includes('кураг')) {
      variation = "курага";
    } else if (title.includes('чернослив')) {
      variation = "чернослив";
    } else if (title.includes('киви')) {
      if (title.includes('клубник')) {
        variation = "киви с клубникой";
      } else {
        variation = "киви";
      }
    } else if (title.includes('манго')) {
      if (title.includes('малин')) {
        variation = "манго с малиной";
      } else if (title.includes('маракуй')) {
        variation = "манго, маракуйя";
      } else {
        variation = "манго";
      }
    } else if (title.includes('зелен')) {
      variation = "зелень";
    } else if (title.includes('паприк')) {
      variation = "паприка";
    } else if (title.includes('перец')) {
      variation = "перец";
    } else if (title.includes('шоколад')) {
      if (title.includes('вишн')) {
        variation = "шоколад/вишня";
      } else if (title.includes('клубник') && title.includes('черник')) {
        variation = "шоколад/клубника/черника";
      } else if (title.includes('мак')) {
        variation = "шоколад/мак";
      } else if (title.includes('персик')) {
        variation = "шоколад/персик";
      } else {
        variation = "шоколад";
      }
    } else if (title.includes('шоколадн')) {
      variation = "шоколадная";
    } else if (title.includes('ананас')) {
      variation = "ананас, виноград";
    } else if (title.includes('виноград')) {
      variation = "ананас, виноград";
    } else if (title.includes('груш')) {
      variation = "груша";
    } else if (title.includes('клюкв')) {
      variation = "клюква";
    } else if (title.includes('маракуй')) {
      variation = "манго, маракуйя";
    } else if (title.includes('персик')) {
      variation = "персик";
    } else if (title.includes('мак')) {
      variation = "мак";
    } else if (title.includes('тыкв')) {
      variation = "тыква";
    } else if (title.includes('с ягодами')) {
      variation = "с ягодами";
    } else if (title.includes('с фруктам')) {
      variation = "с фруктами";
    } else if (title.includes('с мясом')) {
      variation = "с мясом";
    } else if (title.includes('топлен')) {
      variation = "из топленого творога";
    } else if (title.includes('мак-кураг')) {
      variation = "мак-курага";
    } else if (title.includes('мак') && title.includes('кураг')) {
      variation = "мак-курага";
    }

    groups[key].variations.push({
      id: product._id,
      title: variation,
      fullTitle: title, // сохраняем полное название
      image: product.image
    });

    return groups;
  }, {} as Record<string, ProductGroup>);

  // Преобразуем в массив и сортируем
  const groupedArray = Object.values(groupedProducts).sort((a, b) => {
    if (sortColumn === "category") {
      return sortDirection === "asc"
        ? a.category.localeCompare(b.category, "ru")
        : b.category.localeCompare(a.category, "ru");
    } else if (sortColumn === "unit") {
      return sortDirection === "asc"
        ? a.unit.localeCompare(b.unit)
        : b.unit.localeCompare(a.unit);
    } else if (sortColumn === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
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
    <div className="space-y-4 print:space-y-2">
      {/* Invoice Header */}
      <div className="mb-4 print:mb-2 print:break-after-avoid">
        <div className="flex justify-between items-start text-sm">
          <div className="flex-1">
            <div className="font-semibold">НАКЛАДНАЯ № _______ от _____ ________________  202___г.</div>
            <div>ГОРОД ___________________________</div>
            <div className="font-semibold">ГРУЗОПОЛУЧАТЕЛЬ ______________________________________</div>
          </div>
          <div className="flex-1 text-right">
            <div className="font-semibold">ГРУЗООТПРАВИТЕЛЬ</div>
            <div>Домашняя Молочная Продукция,</div>
            <div>Рязанская область г. РЯЗАНЬ</div>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border-collapse print:table">
        <thead>
          <tr className="bg-gray-200 print:bg-transparent">
            <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs">
              Категория
            </th>
            <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs">
              Наименование
            </th>
            <th
              className="px-2 py-1 text-left cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:cursor-default"
              onClick={() => handleSort("unit")}
            >
              Ед.изм.
            </th>

            <th
              className="px-2 py-1 text-left cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:cursor-default"
              onClick={() => handleSort("price")}
            >
              Цена,₽
            </th>

            <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs">
              Вариации
            </th>

            <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs">
              Количество
            </th>
            <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs">
              Сумма
            </th>
          </tr>
        </thead>
        <tbody className="text-xs print:text-xs">
          {groupedArray.map((group, index) => (
            <tr
              key={group.id}
              className={`border-b hover:bg-green-100 transition-colors duration-300 print:border-b print:border-gray-300 print:hover:bg-transparent print:bg-transparent ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="px-2 py-1 print:px-1 print:py-0.5 font-medium">{group.category}</td>
              <td className="px-2 py-1 print:px-1 print:py-0.5">
                <div className="flex flex-col space-y-1">
                  {group.variations.map((variation) => (
                    <Link
                      key={variation.id}
                      href={{ pathname: "/product", query: { _id: variation.id } }}
                      className="text-xs hover:text-blue-600 hover:underline block"
                    >
                      {variation.fullTitle}
                    </Link>
                  ))}
                </div>
              </td>
              <td className="px-2 py-1 print:px-1 print:py-0.5">{group.unit}</td>

              <td className="px-2 py-1 print:px-1 print:py-0.5 font-semibold">{group.price.toFixed(2)}</td>

              <td className="px-2 py-1 print:px-1 print:py-0.5">
                <div className="flex flex-col space-y-1">
                  {group.variations.map((variation) => (
                    <div key={variation.id} className="flex items-center gap-1 h-4">
                      <span className="text-xs">•</span>
                      <span className="text-xs">{variation.title}</span>
                    </div>
                  ))}
                </div>
              </td>



              {/* Поле для рукописного указания количества */}
              <td className="px-2 py-1 print:px-1 print:py-0.5">
                <div className="flex flex-col space-y-1 min-h-[2rem]">
                  {group.variations.map((variation) => (
                    <div key={`${group.id}_${variation.id}`} className="border-b border-gray-300 h-4"></div>
                  ))}
                </div>
              </td>

              {/* Пустое поле для суммы */}
              <td className="px-2 py-1 print:px-1 print:py-0.5">
                <div className="flex flex-col space-y-1 min-h-[2rem]">
                  {group.variations.map((variation) => (
                    <div key={`${group.id}_sum_${variation.id}`} className="border-b border-gray-300 h-4"></div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceListGrouped;