import { ManagerFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@renovabit/ui/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";

export function NavLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					render={
						<Link to="/">
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<HugeiconsIcon icon={ManagerFreeIcons} className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">RenovaBit</span>
								<span className="truncate text-xs">Administrador</span>
							</div>
						</Link>
					}
				></SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
