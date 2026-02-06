import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@renovabit/ui/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@renovabit/ui/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import * as React from "react";

type IconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];

interface NavSecondaryProps {
	items: {
		title: string;
		url: string;
		icon: IconType;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}

export function NavSecondary({ items }: NavSecondaryProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Opciones</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						defaultOpen={item.isActive}
						className="group/collapsible"
						render={
							<SidebarMenuItem>
								<CollapsibleTrigger
									render={
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <HugeiconsIcon icon={item.icon} />}
											<span>{item.title}</span>
											<HugeiconsIcon
												icon={ArrowRight01Icon}
												className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
										</SidebarMenuButton>
									}
								></CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													render={
														<Link to={subItem.url}>
															<span>{subItem.title}</span>
														</Link>
													}
												></SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						}
					></Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
