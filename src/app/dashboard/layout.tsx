import AppTemplate from "@/components/template";
import { requireUser } from "@/lib/dal";

const template = async ({ children }: { children: React.ReactNode }) => {
	const user = await requireUser();

	return <AppTemplate user={user}>{children}</AppTemplate>;
};

export default template;
