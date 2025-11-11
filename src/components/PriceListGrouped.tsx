import { getProducts } from "@/helpers";
import React, { useEffect, useState, useRef } from "react";
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
  const [printScale, setPrintScale] = useState({
    fontSize: '9px',
    headerFontSize: '10px',
    variationFontSize: '8px',
    rowHeight: '4',
    padding: '0.5',
    cellPadding: '0.25'
  });
  const tableRef = useRef<HTMLDivElement>(null);

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

  // Calculate optimal print scaling to fit on almost 2 pages (1.8-1.9)
  useEffect(() => {
    if (groupedArray.length > 0 && typeof window !== 'undefined') {
      const calculateOptimalScale = () => {
        // Rough estimation: more rows per page for better content density
        const rowsPerPage = 70;
        const estimatedPages = groupedArray.length / rowsPerPage;

        if (estimatedPages <= 1.8) {
          // We can fit comfortably, use larger fonts
          setPrintScale({
            fontSize: '14px',
            headerFontSize: '12px',
            variationFontSize: '12px',
            rowHeight: '14',
            padding: '1',
            cellPadding: '0.75'
          });
        } else if (estimatedPages <= 2.0) {
          // Slightly larger than comfortable fit
          setPrintScale({
            fontSize: '14px',
            headerFontSize: '12px',
            variationFontSize: '12px',
            rowHeight: '16',
            padding: '1.75',
            cellPadding: '1.5'
          });
        } else {
          // Scale down to target 1.8-1.9 pages (less aggressive compression)
          const targetPages = 1.99;
          const scale = Math.min(targetPages / estimatedPages, 0.95);
          const newFontSize = Math.max(8, Math.floor(10 * scale));
          const newHeaderSize = Math.max(9, Math.floor(11 * scale));
          const newVariationSize = Math.max(7, Math.floor(9 * scale));
          const newRowHeight = Math.max(4, Math.floor(5 * scale));

          setPrintScale({
            fontSize: `${newFontSize}px`,
            headerFontSize: `${newHeaderSize}px`,
            variationFontSize: `${newVariationSize}px`,
            rowHeight: newRowHeight.toString(),
            padding: Math.max(0.5, Math.floor(0.75 * scale * 100) / 100).toString(),
            cellPadding: Math.max(0.25, Math.floor(0.5 * scale * 100) / 100).toString()
          });
        }
      };

      // Calculate after a short delay to ensure DOM is ready
      const timer = setTimeout(calculateOptimalScale, 100);
      return () => clearTimeout(timer);
    }
  }, [groupedArray.length]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div ref={tableRef} className="space-y-4 print:space-y-2">
      {/* Invoice Header */}
      <div className="mb-4 print:mb-2 print:break-after-avoid">
        <div className="flex justify-between items-start text-sm">
          <div className="flex-1">
            <div className="font-semibold">НАКЛАДНАЯ № _______ от _____ ________________  202___г.</div>
            <div className="font-semibold">ГРУЗОПОЛУЧАТЕЛЬ ______________________________________</div>
          </div>
          <div className="flex-1 text-right">
            <div className="font-semibold">ГРУЗООТПРАВИТЕЛЬ</div>
            <div>Домашняя Молочная Продукция, Рязанская область г. РЯЗАНЬ</div>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border-collapse print:table">
        <thead>
          <tr className="bg-gray-200 print:bg-transparent" style={{ height: `${parseInt(printScale.rowHeight) * 2}px` }}>
            <th
              className="text-left font-bold leading-tight"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
            >
              Категория
            </th>
            <th
              className="text-left font-bold leading-tight"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
            >
              Наименование
            </th>
            <th
              className="text-left font-bold leading-tight cursor-pointer hover:bg-gray-300"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
              onClick={() => handleSort("unit")}
            >
              Ед.изм.
            </th>

            <th
              className="text-left font-bold leading-tight"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
            >
              Заказ
            </th>

            <th
              className="text-left font-bold leading-tight"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
            >
              Вариации
            </th>

            <th
              className="text-left font-bold leading-tight cursor-pointer hover:bg-gray-300"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
              onClick={() => handleSort("price")}
            >
              Цена,₽
            </th>

            <th
              className="text-left font-bold leading-tight"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
            >
              Кол-во по факту
            </th>
            <th
              className="text-left font-bold leading-tight"
              style={{
                padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                fontSize: printScale.headerFontSize,
                lineHeight: '1.2'
              }}
            >
              Сумма
            </th>
          </tr>
        </thead>
        <tbody style={{ fontSize: printScale.fontSize, lineHeight: '1.2' }}>
          {groupedArray.map((group, index) => (
            <tr
              key={group.id}
              className={`border-b hover:bg-green-100 transition-colors duration-300 print:border-b print:border-gray-300 print:hover:bg-transparent ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              style={{ height: `${parseInt(printScale.rowHeight) * 2}px` }}
            >
              <td
                className="font-medium"
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                  fontSize: printScale.fontSize,
                  lineHeight: '1.2'
                }}
              >
                {group.category}
              </td>

              <td
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                  lineHeight: '1.2'
                }}
              >
                <div className="flex flex-col space-y-0">
                  {group.variations.map((variation) => (
                    <Link
                      key={variation.id}
                      href={{ pathname: "/product", query: { _id: variation.id } }}
                      className="hover:text-blue-600 hover:underline block"
                      style={{
                        fontSize: printScale.variationFontSize,
                        lineHeight: '1.1'
                      }}
                    >
                      {variation.fullTitle}
                    </Link>
                  ))}
                </div>
              </td>
              <td
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                  fontSize: printScale.fontSize,
                  lineHeight: '1.2'
                }}
              >
                {group.unit}
              </td>

              {/* Поле для рукописного указания заказа штук */}
              <td></td>

              <td
                className="font-semibold"
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                  fontSize: printScale.fontSize,
                  lineHeight: '1.2'
                }}
              >
                {group.price.toFixed(2)}
              </td>

              <td
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                  lineHeight: '1.2'
                }}
              >
                <div className="flex flex-col space-y-0">
                  {group.variations.map((variation) => (
                    <div key={variation.id} className="flex items-center gap-1" style={{ height: `${parseInt(printScale.rowHeight) * 0.75}px` }}>
                      <span style={{ fontSize: `${parseFloat(printScale.variationFontSize) * 0.8}px` }}>•</span>
                      <span style={{ fontSize: printScale.variationFontSize, lineHeight: '1.1' }}>{variation.title}</span>
                    </div>
                  ))}
                </div>
              </td>

              {/* Поле для рукописного указания количества */}
              <td
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                }}
              >
                <div className="flex flex-col space-y-0" style={{ minHeight: `${parseInt(printScale.rowHeight)}px` }}>
                  {group.variations.map((variation) => (
                    <div key={`${group.id}_${variation.id}`}
                      className="border-b border-gray-300"
                      style={{ height: `${parseInt(printScale.rowHeight) * 0.75}px` }}
                    ></div>
                  ))}
                </div>
              </td>

              {/* Пустое поле для суммы */}
              <td
                style={{
                  padding: `${printScale.cellPadding}px ${printScale.padding}px`,
                }}
              >
                <div className="flex flex-col space-y-0" style={{ minHeight: `${parseInt(printScale.rowHeight)}px` }}>
                  {group.variations.map((variation) => (
                    <div key={`${group.id}_sum_${variation.id}`}
                      className="border-b border-gray-300"
                      style={{ height: `${parseInt(printScale.rowHeight) * 0.75}px` }}
                    ></div>
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