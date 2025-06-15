import { cn } from "@/utils/tailwind";
import { Loader2Icon } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return <Loader2Icon className={cn("animate-spin", className)} />;
}
