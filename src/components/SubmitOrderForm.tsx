"use client";

import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "@/redux/shoppingSlice";
import { useEffect, useState } from "react";
import { ProductsStruct, StateProps } from "../../type";

const SubmitOrderForm = () => {
  const { productData } = useSelector((state: StateProps) => state?.shopping);

  // Состояние для управления видимостью формы
  const [isFormVisible, setFormVisible] = useState(false);
  // Состояние для хранения данных формы
  const [formData, setFormData] = useState({
    name: "",
    email: "aasdvv@gmail.com",
    message: "",
  });

  const dispatch = useDispatch();

  // Обработчик для открытия формы
  const handleOpenForm = () => {
    setFormVisible(true);
  };

  // Обработчик для изменения данных формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик для отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   // Стили для таблицы письма
   const tableStyle = `
             <style type="text/css">
            /* Общие стили */
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
              margin: 0;
              padding: 0;
            }
  
            /* Стили для таблицы */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
  
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
  
            th {
              background-color: #f2f2f2;
            }
  
            /* Стили для ссылок */
            a {
              color: #007bff;
              text-decoration: none;
            }
  
            a:hover {
              text-decoration: underline;
            }
  
            /* Стили для кнопок */
            .btn {
              display: inline-block;
              padding: 8px 16px;
              background-color: #007bff;
              color: #fff;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
  
            .btn:hover {
              background-color: #0056b3;
            }
  
            /* Стили для email-клиентов */
            @media only screen and (max-width: 600px) {
              table {
                width: auto;
              }
  
              th, td {
                display: block;
                text-align: left;
                padding: 5px 0;
              }
  
              th {
                background-color: transparent;
                font-weight: bold;
              }
            }
          </style>
   `
    
   // Формируем HTML-таблицу из данных productData
    const tableHtml = `
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Название</th>
          <th>Цена</th>
          <th>Ед.изм.</th>
          <th>Кол-во</th>
        </tr>
      </thead>
      <tbody>
        ${productData.map((item: ProductsStruct) => `
          <tr>
            <td>${item._id}</td>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.type}</td>
            <td>${item.quantity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    `;


    try {
      const response = await fetch("https://ryazantvorog.ru/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Hosting",
        },
        body: JSON.stringify({ ...formData, table: tableHtml, tablestyle:tableStyle  }),
      });

      if (response.ok) {
        // Сброс корзины после успешной отправки формы
        dispatch(resetCart());
        // Сброс данных формы
        setFormData({ name: "", email: "", message: "" });
        // Скрытие формы
        setFormVisible(false);
        // Дополнительные действия после успешной отправки формы
      } else {
        // Обработка ошибки
        console.error("Ошибка при отправке формы:", response.status);
      }
    } catch (error) {
      // Обработка ошибки сети
      console.error("Ошибка при отправке формы:", error);
    }
  };

  return (
    <div>
      {/* Кнопка для открытия формы ввода имени и телефона */}
      <div className="flex justify-end">
        <button
          onClick={handleOpenForm}
          className="bg-blue-500 text-white mt-4 py-3 px-6 hover:bg-blue-700 cursor-pointer duration-200"
        >
          Отправить запрос и мы перезвоним
        </button>
      </div>

      {/* Форма ввода имени и телефона */}
      {isFormVisible && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Введите ваши контактные данные, мы вам перезвоним по этому заказу.
          </h3>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Ваше Имя"
              className="border border-gray-300 p-2 rounded"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="message"
              placeholder="Сообщение"
              className="border border-gray-300 p-2 rounded"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 duration-200"
            >
              Отправить
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubmitOrderForm;















