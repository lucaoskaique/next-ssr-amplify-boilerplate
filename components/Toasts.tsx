import { toast } from '@/hooks/use-toast';

/**
 * Show a success toast notification with green styling
 */
export const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
    className: 'bg-green-500 text-white dark:bg-green-950',
  });
};

/**
 * Show an error toast notification with red styling
 */
export const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: 'destructive',
  });
};
