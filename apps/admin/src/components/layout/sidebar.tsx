import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@renovabit/ui/components/ui/sidebar";
import * as React from "react";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo.ts";
import { sidebarData } from "../../constants/sidebar-data";
import { NavLogo } from "../sidebar/nav-logo.tsx";
import { NavMain } from "../sidebar/nav-main.tsx";
import { NavSecondary } from "../sidebar/nav-secondary.tsx";
import { NavUser } from "../sidebar/nav-user.tsx";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: (typeof authClientRepo.$Infer.Session)["user"];
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	const { navMain, navSecondary } = sidebarData;

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavLogo />
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={navMain} />
				<NavSecondary items={navSecondary} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
