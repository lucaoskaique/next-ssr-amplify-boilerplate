'use client';

import { verifyResetPassword } from '@/lib/action';
import Heading from '@/components/Heading';
import Input from '@/components/Input';
import Panel from '@/components/Panel';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

export default function Page({
  searchParams: { email },
}: {
  searchParams: { email: string };
}) {
  const [result, dispatch] = useFormState(verifyResetPassword, undefined);
  const router = useRouter();

  useEffect(() => {
    if (result) {
      const searchParams = new URLSearchParams();
      searchParams.set('code', result);
      searchParams.set('email', email);

      router.push(`/login/forgot/reset?${searchParams}`);
    }
  }, [email, result, router]);

  return (
    <form className="w-full" action={dispatch}>
      <ResetPanel email={email} valid={result !== false} />
    </form>
  );
}

function ResetPanel({
  email,
  valid = true,
}: {
  email: string;
  valid?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Panel className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Heading>Check Your Email</Heading>
        <div>Enter the code sent to {email}</div>
      </div>
      <input type="hidden" name="email" value={email} />
      <Input
        autoFocus
        label="Verification Code"
        name="code"
        disabled={pending}
        invalid={valid === false}
      />
      {valid === false && (
        <div className="text-message-error-text">Verification code invalid</div>
      )}
      <div className="flex flex-row items-center justify-between">
        <SubmitButton label="Continue" loading={pending} />
        <Link href="/login/forgot">Send another code</Link>
      </div>
    </Panel>
  );
}
