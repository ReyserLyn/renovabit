import {
	Chart01Icon,
	CouponPercentFreeIcons,
	DashboardSquare01Icon,
	DeliveryBox01Icon,
	Settings01Icon,
	ShoppingCartCheck02FreeIcons,
	StarIcon,
	UserMultiple02FreeIcons,
} from "@hugeicons/core-free-icons";

/** Datos del sidebar: usuario, equipos, navegación principal y secundaria. */
export const sidebarData = {
	navMain: [
		{ name: "Dashboard", url: "/", icon: DashboardSquare01Icon },
		{ name: "Pedidos", url: "/pedidos", icon: ShoppingCartCheck02FreeIcons },
		{ name: "Productos", url: "/productos", icon: DeliveryBox01Icon },
		{ name: "Clientes", url: "/clientes", icon: UserMultiple02FreeIcons },
		{ name: "Cupones", url: "/cupones", icon: CouponPercentFreeIcons },
		{ name: "Reportes", url: "/reportes", icon: Chart01Icon },
	],
	navSecondary: [
		{
			title: "Catálogo",
			url: "/productos",
			icon: DeliveryBox01Icon,
			items: [
				{ title: "Productos", url: "/productos" },
				{ title: "Categorías", url: "/categorias" },
				{ title: "Marcas", url: "/marcas" },
			],
		},
		{
			title: "Ventas",
			url: "/pedidos",
			icon: ShoppingCartCheck02FreeIcons,
			items: [
				{ title: "Pedidos", url: "/pedidos" },
				{ title: "Proformas", url: "/proformas" },
				{ title: "Transacciones", url: "/transacciones" },
			],
		},
		{
			title: "Marketing",
			url: "/cupones",
			icon: CouponPercentFreeIcons,
			items: [
				{ title: "Cupones", url: "/cupones" },
				{ title: "Ofertas", url: "/ofertas" },
			],
		},
		{
			title: "Contenido",
			url: "/productos-destacados",
			icon: StarIcon,
			items: [{ title: "Productos destacados", url: "/productos-destacados" }],
		},
		{
			title: "Configuración",
			url: "/configuracion",
			icon: Settings01Icon,
			items: [
				{ title: "General", url: "/configuracion" },
				{ title: "Usuarios", url: "/usuarios" },
			],
		},
	],
};
