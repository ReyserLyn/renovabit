import { HugeiconsIcon } from "@hugeicons/react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@renovabit/ui/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import * as React from "react";

type IconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];

interface NavMainProps {
	items: {
		name: string;
		url: string;
		icon: IconType;
	}[];
}

export function NavMain({ items }: NavMainProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton
							tooltip={item.name}
							render={
								<Link to={item.url}>
									{item.icon && <HugeiconsIcon icon={item.icon} />}
									<span>{item.name}</span>
								</Link>
							}
						></SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
