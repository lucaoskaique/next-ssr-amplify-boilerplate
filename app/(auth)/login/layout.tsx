import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen flex flex-row">
      <div className="w-6/12 bg-login bg-cover bg-center hidden md:block"></div>
      <div className="w-full md:w-6/12 mt-10 md:items-center flex flex-row justify-center">
        <div className="w-full max-w-lg flex flex-col gap-12 items-center mx-4">
          <div className="text-4xl font-bold">App Name</div>
          {children}
        </div>
      </div>
    </div>
  );
}
