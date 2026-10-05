import { toast } from '@/components/ui/toast';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

type ErrorDetails = {
  error: string;
  errorDescription: string;
};

export function useSearchParamsError(
  translate: (errorDescription: string) => string = (errorDescription) => errorDescription
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const errorDetails = useRef<ErrorDetails | null>(null);

  const getErrorDetails = useCallback(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    if (!error || !errorDescription) return null;
    router.replace(pathname);
    return { error, errorDescription };
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const previous = errorDetails.current;
    const current = getErrorDetails();
    errorDetails.current = current;

    if (previous === null && current !== null) {
      toast.add({
        type: 'error',
        description: translate(current.errorDescription)
      });
    }
  }, [getErrorDetails, translate]);
}
