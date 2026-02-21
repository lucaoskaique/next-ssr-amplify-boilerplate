'use client';

import Heading from '@/components/Heading';
import Panel from '@/components/Panel';
import Link from 'next/link';

export default function Page() {
  return (
    <Panel className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <Heading>Invalid Login Link</Heading>
        <p>The link you used is out of date or has already been used.</p>
        <Link href="/login">Login Again</Link>
      </div>
    </Panel>
  );
}
