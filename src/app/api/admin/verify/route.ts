import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Токен не найден' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    return NextResponse.json({
      user: {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      }
    });
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
    return NextResponse.json(
      { message: 'Недействительный токен' },
      { status: 401 }
    );
  }
}