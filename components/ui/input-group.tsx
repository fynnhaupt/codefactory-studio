import type { HTMLAttributes } from 'react';
import { cn } from 'cn';

function InputGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group"
      className={cn('relative flex w-full items-center', className)}
      {...props}
    />
  );
}

function InputGroupAddon({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn('absolute right-0 flex h-full items-center px-1', className)}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon };
