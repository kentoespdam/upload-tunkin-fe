import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterBadgeProps {
    label: string;
    value: string;
    onRemove: () => void;
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "info";
}

const variantStyles = {
    primary: "bg-blue-50 text-blue-700 border border-blue-200",
    secondary: "bg-purple-50 text-purple-700 border border-purple-200",
    info: "bg-cyan-50 text-cyan-700 border border-cyan-200",
};

export function FilterBadge({
    label,
    value,
    onRemove,
    icon,
    variant = "primary",
}: FilterBadgeProps) {
    return (
        <Badge
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-sm ${variantStyles[variant]}`}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="truncate">
                {label}: <strong>{value}</strong>
            </span>
            <Button
                onClick={onRemove}
                size="icon"
                className={`cursor-pointer rounded-full bg-${variantStyles[variant]} text-${variantStyles[variant]}-foreground size-5 hover:bg-destructive hover:text-destructive-foreground ml-1 shrink-0`}
                type="button"
                aria-label={`Hapus filter ${label}`}
            >
                <X className="size-3" />
            </Button>
        </Badge>
    );
}
