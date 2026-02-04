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
import { ColumnPagination } from "@/components/table/column-pagination";
import { ColumnToggle } from "@/components/table/column-toggle";

interface CategoriesTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	emptyMessage?: string;
	renderBulkActions?: (table: TanStackTable<TData>) => React.ReactNode;
}

export function CategoriesTable<TData, TValue>({
	columns,
	data,
	emptyMessage = "No hay categorías. Añade una para comenzar.",
	renderBulkActions,
}: CategoriesTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "parent", desc: true },
	]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const tableData = useMemo(() => data, [data]);

	const table = useReactTable({
		data: tableData,
		columns,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
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
			<div className="flex items-center justify-between">
				<Input
					placeholder="Filtrar categorías por nombre..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

				<div className="flex items-center gap-2">
					{renderBulkActions?.(table)}
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

			<ColumnPagination table={table} />
		</>
	);
}
