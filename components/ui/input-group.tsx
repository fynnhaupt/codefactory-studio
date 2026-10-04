import type { ComponentProps, HTMLAttributes } from 'react';
import { cn } from 'cn';
import { Input } from '@/components/ui/input';

function InputGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group"
      className={cn('relative flex w-full items-center', className)}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input data-slot="input-group-input" className={cn('min-w-0 flex-1', className)} {...props} />
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

export { InputGroup, InputGroupAddon, InputGroupInput };
