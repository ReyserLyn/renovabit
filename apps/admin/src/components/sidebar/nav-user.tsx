import { ArrowDown01Icon, Logout04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@renovabit/ui/components/ui/avatar.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@renovabit/ui/components/ui/dropdown-menu.tsx";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@renovabit/ui/components/ui/sidebar.tsx";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { authClientRepo } from "@/libs/better-auth/auth-client-repo.ts";

interface NavUserProps {
	user: (typeof authClientRepo.$Infer.Session)["user"];
}

export function NavUser({ user }: NavUserProps) {
	const { isMobile } = useSidebar();
	const { logoutMutation } = useLogout();
	const isPending = logoutMutation.isPending;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.image ?? undefined} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
								<HugeiconsIcon
									icon={ArrowDown01Icon}
									className="ml-auto size-4"
								/>
							</SidebarMenuButton>
						}
					></DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => logoutMutation.mutate(undefined)}
								disabled={isPending}
								aria-busy={isPending}
							>
								<HugeiconsIcon icon={Logout04Icon} />
								{isPending ? "Cerrando sesión…" : "Cerrar sesión"}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
