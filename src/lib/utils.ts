import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PageResponse } from "@/tipes/commons";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const appConfig = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL,
	client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
	client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
};

export const getUrut = (data: PageResponse<unknown>): number => {
	if (!data) return 0;
	return data.is_first ? 1 : (data.page - 1) * data.page_size + 1;
};

export const formatRupiah = (number: number): string => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(number);
};
