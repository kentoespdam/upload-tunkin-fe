import type { BaseResponse } from "@/tipes/commons";

export type CommonFetchProps = {
	path: string;
};
export const fetchData = async <T>({
	path,
}: CommonFetchProps): Promise<BaseResponse<T>> => {
	const req = await fetch(path);
	return await req.json();
};
