import { cookies } from "next/headers";
import type {
	BaseToken,
	JwtToken,
	JwtUserToken,
	LoginToken,
} from "@/tipes/auth";
import "server-only";

export const getSession = async (): Promise<{
	access_token: string;
	refresh_token: string;
}> => {
	const cookieStore = await cookies();
	const refresh_token = cookieStore.get("refresh_token")?.value ?? "";
	const access_token = cookieStore.get("access_token")?.value ?? "";

	return {
		access_token,
		refresh_token,
	};
};

export const getAccessToken = async () => {
	const { access_token } = await getSession();
	return access_token;
};

export const decodeToken = async (
	token: string,
): Promise<JwtUserToken | JwtToken | null> => {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e: unknown) {
		console.log(e);
		return null;
	}
};

export const getExpToken = async (token: string) => {
	const decoded_token = await decodeToken(token);
	return decoded_token ? decoded_token.exp * 1000 : 0;
};

const setCookies = async (name: string, token: string) => {
	try {
		const exp = await getExpToken(token);
		const cookieStore = await cookies();

		cookieStore.set(name, token, {
			httpOnly: true,
			secure: true,
			expires: exp,
			sameSite: "lax",
			path: "/",
		});
	} catch (e) {
		console.log(e);
	}
};

export const createSession = async (token: LoginToken) => {
	await setCookies("access_token", token.access_token);
	if (token.refresh_token)
		await setCookies("refresh_token", token.refresh_token);
};

export const refreshSession = async (token: BaseToken) =>
	await setCookies("access_token", token.access_token);

export const destroySession = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");
	cookieStore.delete("refresh_token");
};

export const getUser = async () => {
	const token = await getAccessToken();
	const decoded_token = await decodeToken(token);
	return decoded_token;
};
