import { Delete04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button.js";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { ActionModal } from "@/components/modals/ActionModal";

interface DataTableBulkDeleteActionProps<TData> {
	table: Table<TData>;
	onDelete: (rows: TData[]) => Promise<void>;
	itemName: string; // e.g., "marcas"
	itemNameSingular: string; // e.g., "marca"
}

export function DataTableBulkDeleteAction<TData>({
	table,
	onDelete,
	itemName,
	itemNameSingular,
}: DataTableBulkDeleteActionProps<TData>) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const count = selectedRows.length;

	if (count === 0) return null;

	const handleConfirm = async () => {
		setIsPending(true);
		try {
			await onDelete(selectedRows.map((row) => row.original));
			table.resetRowSelection();
			setIsOpen(false);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<>
			<Button
				variant="destructive"
				size="sm"
				className="h-8 gap-2"
				onClick={() => setIsOpen(true)}
			>
				<HugeiconsIcon icon={Delete04Icon} className="size-4" />
				Borrar ({count}) {count === 1 ? itemNameSingular : itemName}
			</Button>

			<ActionModal
				open={isOpen}
				onOpenChange={setIsOpen}
				title={`¿Eliminar ${count === 1 ? itemNameSingular : itemName}?`}
				description={
					<>
						Se eliminarán permanentemente{" "}
						<strong>
							{count} {count === 1 ? itemNameSingular : itemName}
						</strong>{" "}
						seleccionados. Esta acción no se puede deshacer.
					</>
				}
				onConfirm={handleConfirm}
				isPending={isPending}
				confirmLabel={`Eliminar ${count === 1 ? itemNameSingular : itemName}`}
				variant="destructive"
			/>
		</>
	);
}
