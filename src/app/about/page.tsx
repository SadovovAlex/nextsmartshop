import React from "react";
import Link from "next/link"; // Используем Link из Next.js для навигации
import Container from "@/components/Container";
import Menu from "@/components/Menu";

const AboutPage = () => {


  return (
    <div>
      <Menu />
      <Container>
        {/* Заголовок */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          О нас
        </h1>

        {/* Блок с текстом */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <p className="text-lg text-gray-600 mb-4">
            Мы работаем с розничными магазинами и продуктовыми рынками, предлагая
            высококачественную продукцию по выгодным условиям.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Также мы осуществляем оптовые поставки на выгодных условиях. Мы
            гарантируем, что все наши продукты соответствуют необходимым
            стандартам качества.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Ветеринарное свидетельство отправляем по системе Меркурий, что
            обеспечивает прозрачность и безопасность наших поставок.
          </p>
          <p className="text-lg text-gray-600">
            Мы предлагаем бесплатную доставку, при определенной сумме заказа.
          </p>
        </div>

        {/* Блок с продукцией */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Описание молока и молочной продукции
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Наша молочная продукция производится из свежего, натурального молока,
            полученного от здоровых коров, которые питаются качественными кормами.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li>Пастеризованное молоко</li>
            <li>Сметана</li>
            <li>Творог</li>
            <li>Йогурты</li>
            <li>Сыры различных сортов</li>
          </ul>
          <p className="text-lg text-gray-600">
            Все наши продукты проходят строгий контроль качества и сохраняют
            все полезные свойства молока, что делает их идеальными для
            здорового питания.
          </p>
        </div>

        {/* Блок с контактами */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Контакты</h2>
          <p className="text-lg text-gray-600 mb-4">
            Телефон: +7(995)963-00-40
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Email: ryazantvorog@gmail.com
          </p>
          <p className="text-lg text-gray-600">
            Адрес: Рязанская область, село Заокское
          </p>
        </div>

       
       
      </Container>
    </div>
  );
};

export default AboutPage;