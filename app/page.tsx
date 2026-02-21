import { getSession } from '@/lib/action';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  console.log('[Server] API_SERVER_URL:', process.env.API_SERVER_URL);
  const session = await getSession();

  if (!session) {
    return redirect('/login');
  }

  // check for redirect URL first
  const cookieStore = cookies();
  const redirectUrl = cookieStore.get('redirectUrl')?.value;

  if (redirectUrl) {
    // clear the redirect cookies
    cookieStore.delete('redirectUrl');
    cookieStore.delete('profileId');

    // redirect to the stored URL
    return redirect(redirectUrl);
  }

  // redirect authenticated users to sse-test
  return redirect('/sse-test');
}
