'use client';

import { authenticate } from '@/lib/action';
import Panel from '@/components/Panel';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useFormState, useFormStatus } from 'react-dom';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';
import Heading from '@/components/Heading';
import PasswordInput from '@/components/PasswordInput';
import Cookies from 'js-cookie';

/**
 * Authenticates the user and handles redirection.
 *
 * @param prevState - The previous state of the application.
 * @param formData - The form data containing user credentials.
 * @returns A promise that resolves to an object containing the authentication result.
 *          If authentication is successful, the object will contain:
 *          - `success`: `true`
 *          - `redirectUrl`: The URL to redirect to, retrieved from cookies.
 *          If authentication fails, the object will contain:
 *          - `success`: `false`
 *          - `error`: The error message from the authentication attempt.
 */
const authenticateWithRedirect = async (prevState: any, formData: FormData) => {
  const result = await authenticate(prevState, formData);

  if (result === true) {
    return {
      success: true,
      redirectUrl: Cookies.get('redirectUrl'),
    };
  }
  return {
    success: false,
    error: result,
  };
};

export default function Page() {
  const [authState, dispatch] = useFormState(authenticateWithRedirect, {
    success: false,
    error: undefined,
    redirectUrl: undefined,
  });
  const router = useRouter();

  useEffect(() => {
    if (authState.success) {
      // get the redirect URL from the cookie
      const redirectUrl = Cookies.get('redirectUrl');

      if (redirectUrl) {
        // clear the cookies
        Cookies.remove('redirectUrl');
        Cookies.remove('profileId');

        // redirect to the stored URL
        router.replace(redirectUrl);
      } else {
        // if no redirect URL go to sse-test
        router.replace('/sse-test');
      }
    }
  }, [authState, router]);

  return (
    <form action={dispatch} className="w-full">
      <FormPanel status={authState.error} />
    </form>
  );
}

function FormPanel({ status }: { status?: string | true }) {
  const { pending } = useFormStatus();

  return (
    <Panel className="flex flex-col gap-8 w-full">
      <Heading>Login</Heading>
      <Input
        label="Username"
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={pending}
        invalid={typeof status === 'string'}
      />
      <PasswordInput
        label="Password"
        name="password"
        placeholder="Password"
        required
        disabled={pending}
        invalid={typeof status === 'string'}
      />
      {typeof status === 'string' && (
        <div className="text-message-error-text">{status}</div>
      )}
      <div className="flex flex-row items-center my-5">
        <SubmitButton
          loading={pending}
          label="Login"
          className="bg-primary-500 shadow text-white py-3 px-6 rounded-full"
        />
        <div className="flex-grow" />
        <Link href="/login/forgot" className="text-dashboard-secondary">
          Trouble signing in?
        </Link>
      </div>
      <div className="items-center flex flex-col">
        <Link href="/login/link">Sign in with a Link instead</Link>
      </div>
    </Panel>
  );
}
