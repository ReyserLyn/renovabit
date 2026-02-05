import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import { Input } from "@renovabit/ui/components/ui/input.js";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@renovabit/ui/components/ui/table.tsx";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	Table as TanStackTable,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
	ColumnPagination,
	ServerPagination,
	type ServerPaginationProps,
} from "@/components/table/column-pagination";
import { ColumnToggle } from "@/components/table/column-toggle";

interface ProductsTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	emptyMessage?: string;
	renderBulkActions?: (table: TanStackTable<TData>) => React.ReactNode;
	onRefresh?: () => void;
	isRefreshing?: boolean;
	/** Filtros (ej. nuqs) a mostrar encima de la barra de búsqueda */
	filterSlot?: React.ReactNode;
	/** Paginación server-side; si se pasa, no se usa paginación en memoria */
	serverPagination?: ServerPaginationProps;
}

export function ProductsTable<TData, TValue>({
	columns,
	data,
	emptyMessage = "No hay productos. Añade uno para comenzar.",
	renderBulkActions,
	onRefresh,
	isRefreshing = false,
	filterSlot,
	serverPagination,
}: ProductsTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const tableData = useMemo(() => data, [data]);
	const useServerPagination = !!serverPagination;

	const table = useReactTable({
		data: tableData,
		columns,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		...(useServerPagination
			? {}
			: { getPaginationRowModel: getPaginationRowModel() }),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			rowSelection,
			columnFilters,
			sorting,
			columnVisibility,
		},
	});

	return (
		<>
			{filterSlot ? <div className="mb-3">{filterSlot}</div> : null}
			<div className="flex items-center justify-between">
				<Input
					placeholder="Filtrar productos por nombre…"
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
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
							aria-label="Actualizar lista de productos"
							title="Actualizar lista"
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
									className="h-24 text-center text-muted-foreground"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
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
