import React from "react";
import Container from "@/components/Container";
import Menu from "@/components/Menu";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Menu />
      <Container>
        <h1 className="text-4xl font-bold text-center mt-10 mb-6 text-gray-800 fade-in">
          О нас
        </h1>
        <div className="max-w-2xl mx-auto text-gray-600 space-y-4 fade-in">
          <p>
            Мы работаем с розничными магазинами и продуктовыми рынками, предлагая
            высококачественную продукцию по выгодным условиям.
          </p>
          <p>
            Также мы осуществляем оптовые поставки на выгодных условиях. Мы
            гарантируем, что все наши продукты соответствуют необходимым
            стандартам качества.
          </p>
          <p>
            Ветеринарное свидетельство отправляем по системе Меркурий, что
            обеспечивает прозрачность и безопасность наших поставок.
          </p>
          <p>
            Мы предлагаем бесплатную доставку в Москву и Московскую область. Дни
            доставки: понедельник, вторник, четверг, пятница и суббота.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-center mt-12 mb-6 text-gray-800 fade-in">
          Описание молока и молочной продукции
        </h2>
        <div className="max-w-2xl mx-auto text-gray-600 space-y-4 fade-in">
          <p>
            Наша молочная продукция производится из свежего, натурального молока,
            полученного от здоровых коров, которые питаются качественными кормами.
            Мы предлагаем широкий ассортимент молочных продуктов, включая:
          </p>
          <ul className="list-disc list-inside">
            <li>Пастеризованное молоко</li>
            <li>Сметана</li>
            <li>Творог</li>
            <li>Йогурты</li>
            <li>Сыры различных сортов</li>
          </ul>
          <p>
            Все наши продукты проходят строгий контроль качества и сохраняют
            все полезные свойства молока, что делает их идеальными для
            здорового питания.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-center mt-12 mb-6 text-gray-800 fade-in">
          Контакты
        </h2>
        <div className="max-w-2xl mx-auto text-gray-600 space-y-4 fade-in">
          <p>
            Телефон:{" "}
            <a
              href="tel:+79959630040"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              +7(995)963-00-40
            </a>
          </p>
          <p>
            e-mail:{" "}
            <a
              href="mailto:ryazantvorog@gmail.com"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              ryazantvorog@gmail.com
            </a>
          </p>
          <p>Адрес: Рязанская область, село Заокское</p>
        </div>

        <footer className="text-center py-6 mt-12 text-gray-500 fade-in">
          <p>© 2024 Рязанская молочная ферма Заокское</p>
        </footer>
      </Container>
    </div>
  );
};

export default AboutPage;