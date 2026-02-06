import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import { Table } from "@tanstack/react-table";

interface DataTableBulkCopyActionProps<TData> {
	table: Table<TData>;
	onCopy: (rows: TData[]) => void;
	itemName: string; // e.g., "usuarios"
	itemNameSingular: string; // e.g., "usuario"
}

export function DataTableBulkCopyAction<TData>({
	table,
	onCopy,
	itemName,
	itemNameSingular,
}: DataTableBulkCopyActionProps<TData>) {
	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const count = selectedRows.length;

	if (count === 0) return null;

	const handleCopy = () => {
		onCopy(selectedRows.map((row) => row.original));
	};

	return (
		<Button
			variant="outline"
			size="sm"
			className="h-8 gap-2"
			onClick={handleCopy}
		>
			<HugeiconsIcon icon={Copy01Icon} className="size-4" />
			Copiar ({count}) {count === 1 ? itemNameSingular : itemName}
		</Button>
	);
}
