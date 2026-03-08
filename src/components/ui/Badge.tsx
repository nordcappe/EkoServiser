import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "blue" | "yellow" | "red" | "gray" | "purple";
  className?: string;
}

export function Badge({ children, variant = "green", className }: BadgeProps) {
  const variants = {
    green:  "bg-green-50 text-green-700 ring-green-600/20",
    blue:   "bg-blue-50 text-blue-700 ring-blue-600/20",
    yellow: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    red:    "bg-red-50 text-red-700 ring-red-600/20",
    gray:   "bg-gray-100 text-gray-600 ring-gray-500/20",
    purple: "bg-purple-50 text-purple-700 ring-purple-600/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
