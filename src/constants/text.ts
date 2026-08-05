// constants/text.ts

export const TEXT: { [key: string]: string } = {
    DELIVERY: 'Бесплатная доставка в Москву, Московскую область, Тула(область), Калуга(область), Липецк(область), при определенной сумме заказа.',
    DELIVERY_SHORT: 'Бесплатная доставка при заказе от определенной суммы',
    DELIVERY_CITIES: 'Москва, МО, Тула, Калуга, Липецк',
    WORKING_HOURS: '08:00 - 18:00',
    WORKING_DAYS: 'Пн-Сб',
    ORDER_HOURS: '08:00 - 10:00',
    WEEKEND: 'Вс - выходной',
    TITLE: 'Рязанская молочная ферма Заокское',
    TITLE_SHORT: 'Рязанская молочная ферма',
    SLOGAN: 'Натуральная молочная продукция из Рязани',
    DESCRIPTION: 'Качественные молочные продукты от производителя',
};

export const CONTACT = {
    PHONE: '+79308887678',
    PHONE_FORMATTED: '+7 (930) 888-76-78',
    PHONE_SHORT: '+7 930 888-76-78',
    EMAIL: 'ryazantvorog@gmail.com',
    ADDRESS: 'Рязанская область, село Заокское',
};

// ===== МАРШРУТЫ =====
export const ROUTES = {
    HOME: '/',
    PRICE: '/price',
    BUKLET: '/buklet',
    ABOUT: '/about',
    CART: '/cart',
    PRODUCT: '/product',
    INVOICE: '/invoice',
};

// ===== НАСТРОЙКИ =====
export const SETTINGS = {
    MIN_ORDER_FOR_FREE_DELIVERY: 5000,
    DELIVERY_PRICE: 500,
    CURRENCY: '₽',
    CURRENCY_CODE: 'RUB',
    LOCALE: 'ru-RU',
};

// ===== ДНИ ДОСТАВКИ =====
export const DELIVERY_DAYS = [
    'Понедельник',
    'Вторник',
    'Четверг',
    'Пятница',
    'Суббота',
];

export default {
    TEXT,
    CONTACT,
    ROUTES,
    SETTINGS,
    DELIVERY_DAYS,
};