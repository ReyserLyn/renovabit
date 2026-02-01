import { Button } from "@renovabit/ui/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@renovabit/ui/components/ui/dialog.tsx";
import { Spinner } from "@renovabit/ui/components/ui/spinner.tsx";
import { ReactNode } from "react";

interface ActionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: ReactNode;
	onConfirm: () => Promise<void>;
	isPending: boolean;
	confirmLabel: string;
	cancelLabel?: string;
	variant?: "default" | "destructive" | "outline" | "secondary";
}

export function ActionModal({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
	isPending,
	confirmLabel,
	cancelLabel = "Cancelar",
	variant = "default",
}: ActionModalProps) {
	const handleOpenChange = (next: boolean, ev?: { cancel?: () => void }) => {
		if (!next && isPending && typeof ev?.cancel === "function") {
			ev.cancel();
			return;
		}
		onOpenChange(next);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						{cancelLabel}
					</Button>
					<Button
						type="button"
						variant={variant}
						onClick={onConfirm}
						disabled={isPending}
						aria-busy={isPending}
					>
						{isPending ? (
							<>
								<Spinner className="size-4 shrink-0" aria-hidden />
								<span>{confirmLabel}...</span>
							</>
						) : (
							confirmLabel
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
