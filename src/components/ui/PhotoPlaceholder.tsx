import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoPlaceholderProps {
  label: string;
  className?: string;
  aspect?: string;
  bare?: boolean;
}

export function PhotoPlaceholder({ label, className, aspect = "aspect-[4/3]", bare = false }: PhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 border-dashed border-cinema-muted/30 bg-cinema-deep/40 px-4 text-center",
        bare ? "border-y" : "rounded-2xl border",
        aspect,
        className
      )}
    >
      <ImagePlus className="h-6 w-6 text-cinema-muted/60" strokeWidth={1.5} />
      <p className="text-[18.9px] font-medium leading-snug text-cinema-muted/70">{label}</p>
    </div>
  );
}
