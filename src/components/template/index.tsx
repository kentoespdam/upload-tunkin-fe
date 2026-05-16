import type { JwtUserToken } from "@/tipes/auth";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import TemplateHeader from "./template-header";
import TemplateSidebar from "./template-sidebar";

const AppTemplate = async ({
	children,
	user,
}: {
	children: React.ReactNode;
	user: JwtUserToken;
}) => {
	return (
		<SidebarProvider
			className="h-svh max-h-svh overflow-hidden"
			style={
				{
					"--sidebar-width": "calc(var(--spacing)*72)",
					"--header-height": "calc(var(--spacing)*12)",
				} as React.CSSProperties
			}
		>
			<TemplateSidebar user={user} variant="inset" />
			<SidebarInset className="overflow-hidden flex flex-col min-w-0 h-svh max-h-svh">
				<TemplateHeader />
				<main className="flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden">
					<div className="@container/main flex flex-1 flex-col min-h-0 min-w-0 gap-2 p-4">
						{children}
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default AppTemplate;
