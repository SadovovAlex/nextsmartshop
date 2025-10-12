import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Логин и пароль обязательны' },
        { status: 400 }
      );
    }

    // Отправка запроса на бэкенд для проверки администратора
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || 'Ошибка аутентификации' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Создание cookie с токеном
    const responseToFrontend = NextResponse.json(
      {
        message: 'Успешный вход',
        user: data.user
      },
      { status: 200 }
    );

    if (data.token) {
      responseToFrontend.cookies.set('adminToken', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
        path: '/'
      });
    }

    return responseToFrontend;
  } catch (error) {
    console.error('Ошибка при входе администратора:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Метод не разрешен' },
    { status: 405 }
  );
}