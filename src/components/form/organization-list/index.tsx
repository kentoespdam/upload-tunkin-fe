"use client";

import { ChevronDownIcon } from "lucide-react";
import { memo } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { OrganizationMini } from "@/tipes/organization";
import { Input } from "../../ui/input";
import EmptyState from "./empty-state";
import OrganizationItem from "./organization-item";
import { useOrganizationList } from "./use-organization-list";

type OrganizationProps = {
	id: string;
	orgs: OrganizationMini[];
	defaultValue?: string;
	onChange: (id: string, value: string) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
	label?: string;
	required?: boolean;
};

const OrganizationList = memo(
	({
		id,
		orgs,
		defaultValue,
		onChange,
		className = "",
		placeholder = "Select an organization",
		disabled = false,
		error,
		label,
		required = false,
	}: OrganizationProps) => {
		const {
			open,
			searchQuery,
			selectedValue,
			inputRef,
			isInputFocused,
			filteredData,
			displayPlaceholder,
			setSearchQuery,
			setIsInputFocused,
			handleOpenChange,
			handleSelect,
			handleInputClick,
			handleKeyDown,
		} = useOrganizationList({
			id,
			orgs,
			defaultValue,
			disabled,
			placeholder,
			onChange,
		});

		return (
			<div className={cn("space-y-2", className)}>
				{label && (
					<label
						htmlFor={id}
						className={cn(
							"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
							error && "text-destructive",
						)}
					>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</label>
				)}

				<div className="relative">
					<Input
						ref={inputRef}
						id={id}
						readOnly
						disabled={disabled}
						className={cn(
							"cursor-pointer transition-all duration-200",
							"peer",
							isInputFocused && "ring-2 ring-primary/20 border-primary",
							error && "border-destructive focus:ring-destructive/20",
							disabled && "cursor-not-allowed opacity-50",
							open && "border-primary",
						)}
						onClick={handleInputClick}
						onKeyDown={handleKeyDown}
						onFocus={() => setIsInputFocused(true)}
						onBlur={() => setIsInputFocused(false)}
						placeholder={displayPlaceholder}
						aria-label={label || "Organization selector"}
						aria-expanded={open}
						aria-haspopup="dialog"
						aria-invalid={!!error}
						aria-describedby={error ? `${id}-error` : undefined}
					/>

					<div className="absolute right-3 top-1/2 -translate-y-1/2">
						<ChevronDownIcon
							className={cn(
								"h-4 w-4 text-muted-foreground transition-transform duration-200",
								open && "rotate-180 text-primary",
							)}
						/>
					</div>
				</div>

				{error && (
					<p
						id={`${id}-error`}
						className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-2 duration-200"
					>
						{error}
					</p>
				)}

				<CommandDialog open={open} onOpenChange={handleOpenChange}>
					<div className="border-b px-4 py-3">
						<h3 className="font-semibold text-lg">Select Organization</h3>
						<p className="text-sm text-muted-foreground">Search by name</p>
					</div>

					<CommandInput
						placeholder="Search organizations..."
						value={searchQuery}
						onValueChange={setSearchQuery}
						className="border-0 focus:ring-0"
						autoFocus
					/>

					<CommandList className="max-h-[350px]">
						{filteredData.length === 0 ? (
							<CommandEmpty>
								<EmptyState
									message="No organizations available"
									hasSearch={!!searchQuery}
								/>
							</CommandEmpty>
						) : (
							<CommandGroup className="p-1">
								{filteredData.map((org, index) => (
									<OrganizationItem
										key={org.id || `org-${index}`}
										org={org}
										selected={selectedValue === org.id}
										onSelect={handleSelect}
									/>
								))}
							</CommandGroup>
						)}
					</CommandList>

					{filteredData.length > 0 && (
						<div className="border-t px-4 py-2 text-xs text-muted-foreground">
							<div className="flex items-center justify-between">
								<span>{filteredData.length} organization(s)</span>
								{searchQuery && (
									<span className="text-primary">
										Searching: "{searchQuery}"
									</span>
								)}
							</div>
						</div>
					)}
				</CommandDialog>
			</div>
		);
	},
);

OrganizationList.displayName = "OrganizationList";

export default OrganizationList;
