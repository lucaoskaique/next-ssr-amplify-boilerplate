import { useState } from 'react';
import Input, { InputProps } from './Input';
import Visible from './icons/Visbile';
import Invisible from './icons/Invisible';

export default function PasswordInput(props: InputProps) {
  const [secure, setSecure] = useState(true);

  return (
    <Input
      type={secure ? 'password' : 'text'}
      {...props}
      rightElement={
        <button
          onClick={() => setSecure(!secure)}
          type="button"
          aria-label={secure ? 'show password' : 'hide password'}
        >
          {secure ? <Invisible size="1.5rem" /> : <Visible size="1.5rem" />}
        </button>
      }
    />
  );
}
