import { type Icon, IconDashboard } from "@tabler/icons-react";
export type NavItem={
    title: string;
    url: string;
    icon?: Icon;
}

export const navMain: NavItem[] = [
  { title: "Dashboard", url: "#", icon: IconDashboard },
];

export const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: navMain,
};