import { toast } from "sonner";

export function toastError(message: string, retryFn?: () => void | Promise<void>) {
  toast.error(message, {
    duration: 5000,
    action: retryFn
      ? { label: "다시 시도", onClick: () => retryFn() }
      : undefined,
  });
}
