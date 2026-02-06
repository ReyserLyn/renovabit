import {
	ArrowLeft01Icon,
	ArrowLeftDoubleIcon,
	ArrowRight01Icon,
	ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renovabit/ui/components/ui/select.tsx";
import { type Table } from "@tanstack/react-table";

export interface ServerPaginationProps {
	total: number;
	pageIndex: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	selectedCount?: number;
	pageSizeOptions?: number[];
	onPageSizeChange?: (size: number) => void;
}

export function ServerPagination({
	total,
	pageIndex,
	pageSize,
	onPageChange,
	selectedCount = 0,
	pageSizeOptions,
	onPageSizeChange,
}: ServerPaginationProps) {
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : pageIndex * pageSize + 1;
	const to = Math.min((pageIndex + 1) * pageSize, total);
	const showRowsPerPage =
		Array.isArray(pageSizeOptions) &&
		pageSizeOptions.length > 0 &&
		typeof onPageSizeChange === "function";

	return (
		<div className="flex items-center justify-between px-2 py-2">
			<div className="text-muted-foreground flex-1 text-sm">
				{selectedCount > 0
					? `${selectedCount} de ${total} filas seleccionadas`
					: `${from}-${to} de ${total} resultados`}
			</div>
			<div className="flex items-center gap-2">
				{showRowsPerPage && (
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Filas por página</p>
						<Select
							value={`${pageSize}`}
							onValueChange={(value) => onPageSizeChange?.(Number(value))}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{pageSizeOptions!.map((size) => (
									<SelectItem key={size} value={`${size}`}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				<span className="text-sm font-medium">
					Página {pageIndex + 1} de {pageCount}
				</span>
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(0)}
					disabled={pageIndex <= 0}
					aria-label="Primera página"
				>
					<HugeiconsIcon icon={ArrowLeftDoubleIcon} />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(pageIndex - 1)}
					disabled={pageIndex <= 0}
					aria-label="Página anterior"
				>
					<HugeiconsIcon icon={ArrowLeft01Icon} />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(pageIndex + 1)}
					disabled={pageIndex >= pageCount - 1}
					aria-label="Siguiente página"
				>
					<HugeiconsIcon icon={ArrowRight01Icon} />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(pageCount - 1)}
					disabled={pageIndex >= pageCount - 1}
					aria-label="Última página"
				>
					<HugeiconsIcon icon={ArrowRightDoubleIcon} />
				</Button>
			</div>
		</div>
	);
}

interface ColumnPaginationProps<TData> {
	table: Table<TData>;
}

export function ColumnPagination<TData>({
	table,
}: ColumnPaginationProps<TData>) {
	return (
		<div className="flex items-center justify-between px-2">
			<div className="text-muted-foreground flex-1 text-sm">
				{table.getFilteredSelectedRowModel().rows.length} de{" "}
				{table.getFilteredRowModel().rows.length} filas seleccionadas.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Filas por página</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 25, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Página {table.getState().pagination.pageIndex + 1} de{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Ir a la primera página</span>
						<HugeiconsIcon icon={ArrowLeftDoubleIcon} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Ir a la página anterior</span>
						<HugeiconsIcon icon={ArrowLeft01Icon} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Ir a la siguiente página</span>
						<HugeiconsIcon icon={ArrowRight01Icon} />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Ir a la última página</span>
						<HugeiconsIcon icon={ArrowRightDoubleIcon} />
					</Button>
				</div>
			</div>
		</div>
	);
}
