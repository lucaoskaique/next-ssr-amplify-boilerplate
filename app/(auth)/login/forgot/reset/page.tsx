'use client';

import { completeResetPassword } from '@/lib/action';
import Heading from '@/components/Heading';
import Panel from '@/components/Panel';
import PasswordInput from '@/components/PasswordInput';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

export default function Page({
  searchParams: { email, code },
}: {
  searchParams: { email: string; code: string };
}) {
  const [result, dispatch] = useFormState(completeResetPassword, undefined);

  if (result === true) {
    return (
      <Panel className="w-full flex flex-col gap-8">
        <div>
          Your password has been successfully reset. You may now login with your
          new password.
        </div>
        <div>
          <Link
            href="/login"
            className="py-3 px-6 rounded-full bg-primary-500 text-white"
          >
            Login
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <form className="w-full" action={dispatch}>
      <ResetPanel
        email={email}
        code={code}
        error={typeof result === 'string' ? result : undefined}
      />
    </form>
  );
}

function ResetPanel({
  email,
  code,
  error,
}: {
  email: string;
  code: string;
  error?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Panel className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Heading>Create New Password</Heading>
      </div>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="code" value={code} />
      <PasswordInput
        autoFocus
        label="New Password"
        name="password"
        disabled={pending}
        invalid={!!error}
      />
      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        disabled={pending}
        invalid={!!error}
      />
      {error && <div className="text-message-error-text">{error}</div>}
      <div className="flex flex-row items-center justify-between">
        <SubmitButton label="Continue" loading={pending} />
      </div>
    </Panel>
  );
}
