import Container from "./Container";
import { motion } from "framer-motion";

interface Props {
  title: string;
}

const BannerText = ({ title }: Props) => {
  const scrollToShop = (distance: number) => {
    window.scrollTo({
      top: distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <Container className="bg-white bg-opacity-70 p-6 rounded-lg w-full md:max-w-none md:p-10 ml-3 mr-3 xs:mt-0">
        <div className="sm:ml-2 md:ml-8">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:text-4xl font-bold text-gray-800 drop-shadow-lg xs:text-base"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-gray-700 drop-shadow-md xs:text-xs"
          >
            Работаем с розничными магазинами, сетями и продуктовыми рынками.
          </motion.p>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-base text-gray-700 drop-shadow-md xs:text-xs"
          >
            Бесплатная доставка в Москву, Московскую область, Тула (область), Калуга (область), при определенной сумме заказа.
          </motion.p>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-base text-gray-700 drop-shadow-md xs:text-xs"
          >
            Дни доставки: пн, вт, чт, пт, сб.
          </motion.p>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-base text-gray-700 drop-shadow-md xs:text-xs"
          >
            Ветеринарное свидетельство отправляем по Меркурию.
          </motion.p>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-base text-gray-700 drop-shadow-md xs:text-xs"
          >
            Опт на выгодных условиях.
          </motion.p>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="xs:text-base font-bold text-gray-900 drop-shadow-md"
          >
            Телефон для заказа: +7(995)963-00-40
          </motion.p>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="xs:text-base font-bold text-gray-900 drop-shadow-md"
          >
            Email: ryazantvorog@gmail.com
          </motion.p>

          {/* <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex gap-x-4 mt-2"
        >
          
          <button className="py-3 px-6 rounded-full bg-slate-200 hover:bg-white duration-200 text-sm uppercase font-semibold" onClick={() => scrollToShop(1100)}>
            Наша продукция
          </button>
          <button className="py-3 px-6 rounded-full bg-slate-200 hover:bg-white duration-200 text-sm uppercase font-semibold" onClick={() => scrollToShop(1100)}>
            Заказать
          </button>
        </motion.div>  */}
        </div>

      </Container>
    </div>
  );
};

export default BannerText;
