'use client';

import Heading from '@/components/Heading';
import Input from '@/components/Input';
import Panel from '@/components/Panel';
import SubmitButton from '@/components/SubmitButton';
import { resetPassword } from '@/lib/action';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

export default function Page() {
  const [result, dispatch] = useFormState(resetPassword, undefined);
  const router = useRouter();

  useEffect(() => {
    if (result?.success) {
      router.push(
        `/login/forgot/verify?email=${encodeURIComponent(result.email)}`,
      );
    }
  }, [result, router]);

  return (
    <form action={dispatch} className="w-full">
      <FormPanel error={!result?.success ? result?.error : undefined} />
    </form>
  );
}

function FormPanel({ error }: { error?: string }) {
  const { pending } = useFormStatus();

  return (
    <Panel className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <Heading>Forgot Password</Heading>
        <p>To reset your password, enter your email address </p>
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
        <SubmitButton label="Reset Password" loading={pending} />
      </div>
    </Panel>
  );
}
