import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@renovabit/ui/components/ui/breadcrumb.tsx";
import { Separator } from "@renovabit/ui/components/ui/separator.tsx";
import { SidebarTrigger } from "@renovabit/ui/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export type BreadcrumbItemConfig = {
	label: string;
	to?: string;
};

type AuthenticatedHeaderProps = {
	breadcrumbs: BreadcrumbItemConfig[];
};

export function AuthenticatedHeader({ breadcrumbs }: AuthenticatedHeaderProps) {
	const items =
		breadcrumbs.length > 0
			? breadcrumbs
			: [{ label: "Panel de Administración" }];

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex flex-1 items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{items.map((item, i) => {
							const isLast = i === items.length - 1;
							const hideOnMobile = !isLast;
							return (
								<Fragment key={i}>
									{i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
									<BreadcrumbItem
										className={hideOnMobile ? "hidden md:block" : undefined}
									>
										{isLast || item.to === undefined ? (
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink render={<Link to={item.to} />}>
												{item.label}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
