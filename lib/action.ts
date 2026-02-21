'use server';

import { Session, UserLoginResponse } from '@/types/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from './client';

export async function getSession(): Promise<Session | undefined> {
  console.log(
    '[Server Action] getSession - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  const sessionCookie = cookies().get('user');

  if (!sessionCookie) {
    return undefined;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    // invalid login cookie
    console.error('error is', e);
  }

  return undefined;
}

export async function authenticate(
  _currentState: unknown,
  formData: FormData,
): Promise<string | true> {
  console.log(
    '[Server Action] authenticate - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  try {
    const email = (formData.get('email') as string) || '';
    const password = (formData.get('password') as string) || '';
    const client = getClient();

    const user = await client.login(email, password);
    createSession(user);

    return true;
  } catch (error) {
    console.error(error);
    return 'Invalid email or password. Please try again.';
  }
}

export async function createSession(user: UserLoginResponse) {
  cookies().set('user', JSON.stringify(user));
}

export async function logOut() {
  cookies().delete('user');
  redirect('/login');
}

export async function resetPassword(
  _currentState: unknown,
  formData: FormData,
): Promise<
  { success: true; email: string } | { success: false; error: string }
> {
  const client = getClient();

  const email = formData.get('email') as string;

  try {
    await client.resetPassword({ email });
    return { success: true, email };
  } catch (e) {
    console.error('error is', e);
    return { success: false, error: 'Email not found.' };
  }
}

export async function verifyResetPassword(
  _currentState: unknown,
  formData: FormData,
): Promise<string | false> {
  const client = getClient();

  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  try {
    await client.verifyPasswordResetCode({ email, code });
    return code;
  } catch (e) {
    console.error('error is', e);
    return false;
  }
}

export async function completeResetPassword(
  _currentState: unknown,
  formData: FormData,
): Promise<string | true> {
  const client = getClient();

  const email = formData.get('email') as string;
  const code = formData.get('code') as string;
  const password = (formData.get('password') as string)?.trim();
  const confirmPassword = (formData.get('confirmPassword') as string)?.trim();

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  try {
    await client.completePasswordReset({ email, code, password });
    return true;
  } catch (e) {
    console.error('error is', e);
    return 'Error resetting password.';
  }
}

export async function loginWithEmail(
  _currentState: unknown,
  formData: FormData,
): Promise<
  { success: true; email: string } | { success: false; error: string }
> {
  const client = getClient();

  const email = formData.get('email') as string;

  try {
    await client.requestSigninEmail(email);
    return { success: true, email };
  } catch (e) {
    console.error('error is', e);
    return { success: false, error: 'Email not found.' };
  }
}
