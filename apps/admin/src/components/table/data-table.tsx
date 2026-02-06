import { Add01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import { Input } from "@renovabit/ui/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@renovabit/ui/components/ui/table";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	type Table as TanStackTableType,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
	ColumnPagination,
	ServerPagination,
	type ServerPaginationProps,
} from "@/components/table/column-pagination";
import { ColumnToggle } from "@/components/table/column-toggle";

export type { ServerPaginationProps };

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	/** Mensaje cuando no hay filas */
	emptyMessage: string;
	/** Placeholder del input de búsqueda por nombre */
	filterPlaceholder: string;
	/** Id de la columna usada para filtrar (debe existir en columns) */
	filterColumnId?: string;
	/** Orden inicial de la tabla */
	defaultSorting?: SortingState;
	/** Contenido extra encima de la barra de búsqueda (ej. filtros nuqs) */
	filterSlot?: React.ReactNode;
	/** Paginación desde servidor; si no se pasa, se usa paginación en memoria */
	serverPagination?: ServerPaginationProps;
	/** Callback para refrescar datos */
	onRefresh?: () => void;
	/** Indica que se está refrescando (deshabilita botón y muestra spinner) */
	isRefreshing?: boolean;
	/** Etiqueta accesible del botón refrescar */
	refreshAriaLabel?: string;
	/** Renderiza acciones sobre filas seleccionadas (ej. borrado masivo) */
	renderBulkActions?: (table: TanStackTableType<TData>) => React.ReactNode;
	/** Si se pasa con onEmptyAction, muestra empty state con botón (ej. "Crear primer producto") */
	emptyActionLabel?: string;
	/** Callback del botón del empty state */
	onEmptyAction?: () => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	emptyMessage,
	filterPlaceholder,
	filterColumnId = "name",
	defaultSorting = [],
	filterSlot,
	serverPagination,
	onRefresh,
	isRefreshing = false,
	refreshAriaLabel = "Actualizar lista",
	renderBulkActions,
	emptyActionLabel,
	onEmptyAction,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>(defaultSorting);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const tableData = useMemo(() => data, [data]);
	const useServerPagination = Boolean(serverPagination);

	const coreRowModel = useMemo(() => getCoreRowModel(), []);
	const paginationRowModel = useMemo(() => getPaginationRowModel(), []);
	const sortedRowModel = useMemo(() => getSortedRowModel(), []);
	const filteredRowModel = useMemo(() => getFilteredRowModel(), []);

	const table = useReactTable({
		data: tableData,
		columns,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: coreRowModel,
		...(useServerPagination
			? {}
			: { getPaginationRowModel: paginationRowModel }),
		getSortedRowModel: sortedRowModel,
		getFilteredRowModel: filteredRowModel,
		state: {
			rowSelection,
			columnFilters,
			sorting,
			columnVisibility,
		},
	});

	const filterColumn = table.getColumn(filterColumnId);

	return (
		<>
			{filterSlot ? <div className="mb-3">{filterSlot}</div> : null}
			<div className="flex items-center justify-between gap-4">
				<Input
					placeholder={filterPlaceholder}
					value={(filterColumn?.getFilterValue() as string) ?? ""}
					onChange={(e) => filterColumn?.setFilterValue(e.target.value)}
					className="max-w-sm"
					aria-label={filterPlaceholder}
				/>
				<div className="flex items-center gap-2">
					{renderBulkActions?.(table)}
					{onRefresh && (
						<Button
							type="button"
							variant="outline"
							size="default"
							onClick={onRefresh}
							disabled={isRefreshing}
							aria-label={refreshAriaLabel}
							title="Refrescar"
						>
							<HugeiconsIcon
								icon={Refresh01Icon}
								className={`size-4 shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
							/>
							<span>Refrescar</span>
						</Button>
					)}
					<ColumnToggle table={table} />
				</div>
			</div>

			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-40 py-12 text-center"
								>
									<div className="flex flex-col items-center gap-3">
										{emptyActionLabel && onEmptyAction ? (
											<>
												<HugeiconsIcon
													icon={Add01Icon}
													className="size-10 text-muted-foreground"
													aria-hidden
												/>
												<p className="text-muted-foreground">{emptyMessage}</p>
												<Button onClick={onEmptyAction} size="sm">
													{emptyActionLabel}
												</Button>
											</>
										) : (
											<p className="text-muted-foreground">{emptyMessage}</p>
										)}
									</div>
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() ? "selected" : undefined}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{useServerPagination && serverPagination ? (
				<ServerPagination
					{...serverPagination}
					selectedCount={table.getFilteredSelectedRowModel().rows.length}
				/>
			) : (
				<ColumnPagination table={table} />
			)}
		</>
	);
}
