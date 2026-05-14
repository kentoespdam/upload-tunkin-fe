"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { OrganizationMini } from "@/tipes/organization";
import { Input } from "../ui/input";

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

// 1. Memoize Empty State dengan animasi
const EmptyState = memo(
	({ message, hasSearch }: { message: string; hasSearch: boolean }) => (
		<div className="flex flex-col items-center justify-center p-6 text-center">
			<div className="mb-3 h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
				<span className="text-muted-foreground text-2xl">🏢</span>
			</div>
			<p className="text-sm text-muted-foreground mb-2">
				{hasSearch ? "No matching organizations found" : message}
			</p>
			{hasSearch && (
				<p className="text-xs text-muted-foreground">
					Try a different search term
				</p>
			)}
		</div>
	),
);
EmptyState.displayName = "EmptyState";

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
		const [open, setOpen] = useState(false);
		const [searchQuery, setSearchQuery] = useState("");
		const [selectedValue, setSelectedValue] = useState(defaultValue || "");
		const inputRef = useRef<HTMLInputElement>(null);
		const [isInputFocused, setIsInputFocused] = useState(false);

		// 2. Filter data dengan useMemo untuk performa
		const filteredData = useMemo(() => {
			if (!orgs) return [];
			if (!searchQuery.trim()) return orgs;

			const query = searchQuery.toLowerCase();
			return orgs.filter(
				(item) =>
					item.org_name.toLowerCase().includes(query) ||
					item.org_id.toLowerCase().includes(query),
			);
		}, [orgs, searchQuery]);

		// 3. Selected organization info dengan useMemo
		const selectedOrg = useMemo(() => {
			if (!orgs) return null;
			return orgs.find((item) => item.org_id === selectedValue) || null;
		}, [orgs, selectedValue]);

		// 4. Placeholder text dengan useMemo
		const displayPlaceholder = useMemo(() => {
			if (!orgs || orgs.length === 0) return "No organizations available";
			return placeholder;
		}, [orgs, placeholder]);

		// 5. Event handlers dengan useCallback
		const handleOpenChange = useCallback(
			(isOpen: boolean) => {
				if (disabled) return;
				setOpen(isOpen);
				if (!isOpen) {
					// Reset search ketika dialog ditutup
					setTimeout(() => setSearchQuery(""), 300);
				}
			},
			[disabled],
		);

		const handleSelect = useCallback(
			(orgId: string) => {
				setSelectedValue(orgId);
				onChange(id, orgId);
				setOpen(false);
			},
			[id, onChange],
		);

		const handleInputClick = useCallback(() => {
			if (!disabled) {
				setOpen(true);
			}
		}, [disabled]);

		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if ((e.key === "Enter" || e.key === " ") && !disabled && !open) {
					e.preventDefault();
					setOpen(true);
				}
				if (e.key === "Escape" && open) {
					setOpen(false);
				}
			},
			[disabled, open],
		);

		// 6. Effect untuk sync dengan defaultValue eksternal
		useEffect(() => {
			if (defaultValue !== undefined) {
				setSelectedValue(defaultValue);
			}
		}, [defaultValue]);

		// 7. Reset input value ketika selectedOrg berubah
		useEffect(() => {
			if (inputRef.current) {
				inputRef.current.value = selectedOrg?.org_name || "";
			}
		}, [selectedOrg]);

		return (
			<div className={cn("space-y-2", className)}>
				{/* 8. Label dengan styling yang baik */}
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

				{/* 9. Input dengan animasi focus */}
				<div className="relative">
					<Input
						ref={inputRef}
						id={id}
						readOnly
						disabled={disabled}
						className={cn(
							"cursor-pointer transition-all duration-200",
							"peer",
							// Focus states
							isInputFocused && "ring-2 ring-primary/20 border-primary",
							// Error state
							error && "border-destructive focus:ring-destructive/20",
							// Disabled state
							disabled && "cursor-not-allowed opacity-50",
							// Open state
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

					{/* 10. Icon dengan animasi */}
					<div className="absolute right-3 top-1/2 -translate-y-1/2">
						<ChevronDownIcon
							className={cn(
								"h-4 w-4 text-muted-foreground transition-transform duration-200",
								open && "rotate-180 text-primary",
							)}
						/>
					</div>
				</div>

				{/* 11. Error message dengan animasi */}
				{error && (
					<p
						id={`${id}-error`}
						className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-2 duration-200"
					>
						{error}
					</p>
				)}

				{/* 12. Command Dialog dengan custom styling */}
				<CommandDialog open={open} onOpenChange={handleOpenChange}>
					{/* 13. Header dengan animasi */}
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
								{filteredData.map((org) => (
									<CommandItem
										key={org.org_id}
										value={`${org.org_name} ${org.org_id}`}
										onSelect={() => handleSelect(org.org_id)}
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
											{/* 14. Organization avatar/icon */}
											<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
												<span className="text-xs font-medium text-primary">
													{org.org_name.charAt(0).toUpperCase()}
												</span>
											</div>

											<div className="flex flex-col">
												<span className="font-medium truncate max-w-[200px]">
													{org.org_name}
												</span>
											</div>
										</div>

										{/* 15. Checkmark untuk selected item */}
										{selectedValue === org.org_id && (
											<CheckIcon className="h-4 w-4 text-primary ml-2 shrink-0 animate-in fade-in-0 zoom-in-50 duration-200" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>

					{/* 16. Footer dengan count */}
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
	(prevProps, nextProps) => {
		// 17. Custom memo comparison
		return (
			prevProps.id === nextProps.id &&
			prevProps.orgs === nextProps.orgs &&
			prevProps.defaultValue === nextProps.defaultValue &&
			prevProps.className === nextProps.className &&
			prevProps.placeholder === nextProps.placeholder &&
			prevProps.disabled === nextProps.disabled &&
			prevProps.error === nextProps.error &&
			prevProps.label === nextProps.label &&
			prevProps.required === nextProps.required
		);
	},
);

OrganizationList.displayName = "OrganizationList";

export default OrganizationList;
