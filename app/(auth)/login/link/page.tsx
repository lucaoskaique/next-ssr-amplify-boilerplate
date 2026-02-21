'use client';

import { loginWithEmail } from '@/lib/action';
import Heading from '@/components/Heading';
import Input from '@/components/Input';
import Panel from '@/components/Panel';
import SubmitButton from '@/components/SubmitButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

export default function Page() {
  const [result, dispatch] = useFormState(loginWithEmail, undefined);
  const router = useRouter();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (result?.success) {
      setSuccess(result.email);
    }
  }, [result, router]);

  return (
    <form action={dispatch} className="w-full">
      {success ? (
        <Success email={success} />
      ) : (
        <FormPanel error={!result?.success ? result?.error : undefined} />
      )}
    </form>
  );
}

function FormPanel({ error }: { error?: string }) {
  const { pending } = useFormStatus();

  return (
    <Panel className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <Heading>Login with an Email</Heading>
        <p>
          Skip the password and log in via a Link sent to your email address
          instead.
        </p>
      </div>
      <Input
        label="Email"
        type="email"
        required
        disabled={pending}
        name="email"
        invalid={!!error}
      />
      {error && <div className="text-message-error-text">{error}</div>}
      <div>
        <SubmitButton label="Email me a Link" loading={pending} />
      </div>
    </Panel>
  );
}

function Success({ email }: { email: string }) {
  return (
    <Panel className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <Heading>Check Your Email!</Heading>
        <p>
          A magic link has been sent to <strong>{email}</strong>. Click the link
          to login.
        </p>
      </div>
    </Panel>
  );
}
