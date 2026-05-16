"use client";

import { CheckIcon } from "lucide-react";
import { memo } from "react";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { OrganizationMini } from "@/tipes/organization";

type OrganizationItemProps = {
	org: OrganizationMini;
	selected: boolean;
	onSelect: (orgId: string) => void;
};

const OrganizationItem = memo(
	({ org, selected, onSelect }: OrganizationItemProps) => (
		<CommandItem
			value={`${org.name} ${org.id}`}
			onSelect={() => onSelect(org.id)}
			className={cn(
				"relative flex items-center justify-between rounded-lg px-3 py-2.5",
				"transition-all duration-150",
				"hover:bg-accent hover:text-accent-foreground",
				"focus:bg-accent focus:text-accent-foreground",
				"data-[selected=true]:bg-primary/10",
				"cursor-pointer",
			)}
		>
			<div className="flex flex-1 items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
					<span className="text-xs font-medium text-primary">
						{org.name?.charAt(0)?.toUpperCase() || "?"}
					</span>
				</div>

				<div className="flex flex-col">
					<span className="font-medium max-w-[200px]">{org.name}</span>
				</div>
			</div>

			{selected && (
				<CheckIcon className="h-4 w-4 text-primary ml-2 shrink-0 animate-in fade-in-0 zoom-in-50 duration-200" />
			)}
		</CommandItem>
	),
);
OrganizationItem.displayName = "OrganizationItem";

export default OrganizationItem;
