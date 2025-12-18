"use client";

import type { VariantProps } from "class-variance-authority";
import { RefreshCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type buttonVariants } from "./button";

type LoadingButtonClientProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		isPending: boolean;
		icon?: React.ReactNode;
	};
const LoadingButtonClient = ({
	isPending,
	icon,
	...props
}: LoadingButtonClientProps) => {
	return (
		<Button {...props} disabled={isPending}>
			{isPending ? (
				<RefreshCcwIcon
					className={cn("mr-0 animate-spin", { "mr-2": props.title })}
				/>
			) : icon ? (
				icon
			) : null}
			<span>{props.title}</span>
		</Button>
	);
};

export default LoadingButtonClient;
