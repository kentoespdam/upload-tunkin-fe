"use server";

import { redirect } from "next/navigation";
import { signOut } from "./session";

/**
 * User-facing logout action.
 */
export const logout = async () => {
	await signOut();
	redirect("/login");
};
