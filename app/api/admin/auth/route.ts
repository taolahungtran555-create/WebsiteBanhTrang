import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@banhtrang.vn';
const ADMIN_PASSWORD = 'admin123';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 giờ
      path: '/',
    });
    return response;
  }

  return NextResponse.json(
    { message: 'Sai email hoặc mật khẩu' },
    { status: 401 }
  );
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
