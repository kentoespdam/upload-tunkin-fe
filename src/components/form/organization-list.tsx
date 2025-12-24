"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { fetchOrganization } from "@/action/server/organization";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import type { OrganizationMini } from "@/tipes/organization";
import { Input } from "../ui/input";

type OrganizationProps = {
    id: string;
    defaultValue?: string;
    onChange: (id: string, value: string) => void;
};
const OrganizationList = ({
    id,
    defaultValue,
    onChange,
}: OrganizationProps) => {
    const { data, isLoading, isFetching } = useQuery<OrganizationMini[]>({
        queryKey: ["organization"],
        queryFn: async () => await fetchOrganization(),
    });

    const [open, setOpen] = useState(false);

    const showLoading = isLoading || isFetching;
    const isDataEmpty = !data || data.length === 0;
    const placeholderText = showLoading
        ? "Loading..."
        : isDataEmpty
            ? "No data available"
            : "Select an organization";

    const valueChange = useCallback(
        (value: string) => {
            onChange(id, value);
        },
        [id, onChange],
    );

    const getValueString = () => {
        return data?.find((item) => item.org_id === defaultValue)?.org_name;
    };

    return (
        <div>
            <div className="relative w-full">
                <Input
                    readOnly
                    id={id}
                    className="cursor-pointer"
                    onClick={() => setOpen((prev) => !prev)}
                    onFocus={() => setOpen((prev) => !prev)}
                    defaultValue={isDataEmpty ? placeholderText : getValueString()}
                />
                <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-50" />
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        {isDataEmpty ? (
                            <CommandItem disabled>
                                <span>{placeholderText}</span>
                            </CommandItem>
                        ) : (
                            data?.map((organization) => (
                                <CommandItem
                                    key={organization.org_id}
                                    onSelect={() => {
                                        valueChange(organization.org_id);
                                        setOpen(false);
                                    }}
                                >
                                    <span>{organization.org_name}</span>
                                </CommandItem>
                            ))
                        )}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    );
};

export default OrganizationList;
