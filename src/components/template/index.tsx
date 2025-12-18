import type { JwtUserToken } from "@/tipes/auth";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import TemplateHeader from "./template-header";
import TemplateSidebar from "./template-sidebar";

const AppTemplate = ({
	children,
	user,
}: {
	children: React.ReactNode;
	user: JwtUserToken;
}) => {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing)*72)",
					"--header-height": "calc(var(--spacing)*12)",
				} as React.CSSProperties
			}
		>
			<TemplateSidebar user={user} variant="inset" />
			<SidebarInset>
				<TemplateHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2 p-4">
						{children}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default AppTemplate;
