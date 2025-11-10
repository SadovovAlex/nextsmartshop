"use client";

import React, { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto cookie-consent">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Мы собираем этот чертов куки, как и все. 
            Это соответствует{" "}
            <a 
              href="/privacy-policy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Политике
            </a>. 
            Продолжая работу с сайтом, Вы даёте согласие на обработку персональных данных.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={acceptConsent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Ну ОК
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;