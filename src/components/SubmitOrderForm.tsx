"use client";


import { useEffect, useState } from "react";


const SubmitOrderForm = () => {
 // Состояние для управления видимостью формы
 const [isFormVisible, setFormVisible] = useState(false);
  
 // Обработчик для открытия формы
 const handleOpenForm = () => {
   setFormVisible(true);
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
                    <h3 className="text-lg font-semibold mb-2">Введите ваши данные</h3>
                    <form className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Ваше Имя"
                        className="border border-gray-300 p-2 rounded"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Телефон для связи"
                        className="border border-gray-300 p-2 rounded"
                        required
                      />
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
