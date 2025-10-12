import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Успешный выход' },
      { status: 200 }
    );

    // Очистка cookie с токеном
    response.cookies.delete('adminToken');

    return response;
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}