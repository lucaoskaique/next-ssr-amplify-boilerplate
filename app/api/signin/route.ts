import { createSession } from '@/lib/action';
import { getClient } from '@/lib/client';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  console.log(
    '[Server API] signin route - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  const params = req.nextUrl.searchParams;

  const token = params.get('token');

  if (!token) {
    return new Response('Invalid request', { status: 400 });
  }

  const client = getClient();

  let successfulLogin = false;

  try {
    const user = await client.loginWithToken(token);
    await createSession(user);
    successfulLogin = true;
  } catch (e) {
    console.error('Error during email signin', e);
  }

  if (successfulLogin) {
    redirect('/');
  } else {
    redirect(`/login/link/invalid`);
  }
}
