import { ReactNode } from 'react';

export default function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl font-bold text-dashboard-primary">{children}</h2>
  );
}
