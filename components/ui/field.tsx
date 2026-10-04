import type { HTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from 'cn';

function FieldGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="field-group" className={cn('flex flex-col gap-5', className)} {...props} />
  );
}

function Field({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="field" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label data-slot="field-label" className={cn('text-sm font-medium', className)} {...props} />
  );
}

function FieldDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-destructive text-sm', className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldGroup, FieldLabel };
