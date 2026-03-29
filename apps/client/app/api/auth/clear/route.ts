import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_URL));

  response.cookies.delete('refreshToken');
  response.cookies.delete('access_token');

  return response;
}
