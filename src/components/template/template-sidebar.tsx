import { IconInnerShadowTop } from "@tabler/icons-react";
import Link from "next/link";
import type { JwtUserToken } from "@/tipes/auth";
import { navMain } from "@/tipes/template";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import TemplateNavMain from "./template-nav-main";
import TemplateUserNav from "./template-user";

const TemplateSidebar = ({
  user,
  ...props
}: { user: JwtUserToken } & React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Perumdam TS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <TemplateNavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <TemplateUserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default TemplateSidebar;