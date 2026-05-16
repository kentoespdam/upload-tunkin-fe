"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OrganizationMini } from "@/tipes/organization";

type UseOrganizationListArgs = {
	id: string;
	orgs: OrganizationMini[];
	defaultValue?: string;
	disabled: boolean;
	placeholder: string;
	onChange: (id: string, value: string) => void;
};

export function useOrganizationList({
	id,
	orgs,
	defaultValue,
	disabled,
	placeholder,
	onChange,
}: UseOrganizationListArgs) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedValue, setSelectedValue] = useState(defaultValue || "");
	const inputRef = useRef<HTMLInputElement>(null);
	const [isInputFocused, setIsInputFocused] = useState(false);

	const filteredData = useMemo(() => {
		if (!orgs) return [];
		if (!searchQuery.trim()) return orgs;

		const query = searchQuery.toLowerCase();
		return orgs.filter(
			(item) =>
				item.name?.toLowerCase().includes(query) ||
				item.id?.toLowerCase().includes(query),
		);
	}, [orgs, searchQuery]);

	const selectedOrg = useMemo<OrganizationMini | null>(() => {
		if (!orgs) return null;
		return orgs.find((item) => item.id === selectedValue) || null;
	}, [orgs, selectedValue]);

	const displayPlaceholder = useMemo(() => {
		if (!orgs || orgs.length === 0) return "No organizations available";
		return placeholder;
	}, [orgs, placeholder]);

	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			if (disabled) return;
			setOpen(isOpen);
			if (!isOpen) {
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
		if (!disabled) setOpen(true);
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

	useEffect(() => {
		if (defaultValue !== undefined) {
			setSelectedValue(defaultValue);
		}
	}, [defaultValue]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = selectedOrg?.name || "";
		}
	}, [selectedOrg]);

	return {
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
	};
}
