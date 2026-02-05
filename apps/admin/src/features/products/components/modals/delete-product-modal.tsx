import { Button } from "@renovabit/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog";

interface DeleteProductModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	productName?: string;
	isPending?: boolean;
}

export function DeleteProductModal({
	open,
	onOpenChange,
	onConfirm,
	productName,
	isPending,
}: DeleteProductModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>¿Estás completamente seguro?</DialogTitle>
					<DialogDescription>
						Esta acción no se puede deshacer. Esto eliminará permanentemente el
						producto
						{productName ? (
							<span className="font-medium text-foreground">
								{" "}
								"{productName}"{" "}
							</span>
						) : (
							" "
						)}
						y sus imágenes de los servidores.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
						disabled={isPending}
						aria-busy={isPending}
					>
						{isPending ? "Eliminando…" : "Eliminar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
