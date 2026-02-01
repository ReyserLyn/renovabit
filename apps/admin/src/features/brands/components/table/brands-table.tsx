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
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTablePagination } from "@/components/table/column-pagination";
import { DataTableViewOptions } from "@/components/table/column-toggle";

interface BrandsTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	emptyMessage?: string;
}

export function BrandsTable<TData, TValue>({
	columns,
	data,
	emptyMessage = "No hay marcas. Añade una para comenzar.",
}: BrandsTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const tableData = useMemo(() => data, [data]);

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
		getPaginationRowModel: paginationRowModel,
		getSortedRowModel: sortedRowModel,
		getFilteredRowModel: filteredRowModel,
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
					placeholder="Filtrar marcas por nombre..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

				<DataTableViewOptions table={table} />
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

			<DataTablePagination table={table} />
		</>
	);
}
