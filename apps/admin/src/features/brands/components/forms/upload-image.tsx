import {
	Alert01Icon,
	Cancel01Icon,
	CloudUploadIcon,
	Image01Icon,
	Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "@renovabit/ui/components/ui/alert.tsx";
import { Button } from "@renovabit/ui/components/ui/button.tsx";
import { cn } from "@renovabit/ui/lib/utils.ts";
import { useEffect, useState } from "react";
import { formatBytes, useFileUpload } from "../../../../hooks/use-file-upload";

interface UploadImageProps {
	value?: string | File;
	onChange?: (value: File | string | undefined) => void;
	maxSize?: number;
	accept?: string;
	className?: string;
	label?: string;
	disabled?: boolean;
}

export default function UploadImage({
	value,
	onChange,
	maxSize = 5 * 1024 * 1024, // 5MB default
	accept = "image/*",
	className,
	label = "Logo de la Marca",
	disabled = false,
}: UploadImageProps) {
	const [imageLoading, setImageLoading] = useState(true);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const [state, actions] = useFileUpload({
		maxFiles: 1,
		maxSize,
		accept,
		multiple: false,
		onFilesChange: (files) => {
			if (files?.[0]) {
				setImageLoading(true);
				setUploadError(null);

				const firstFile = files[0].file;
				if (firstFile instanceof File) {
					// Use setTimeout to avoid "Cannot update a component while rendering a different component"
					setTimeout(() => {
						onChange?.(firstFile);
					}, 0);
				}
			}
		},
	});

	const [preview, setPreview] = useState<string | undefined>(
		typeof value === "string" ? value : undefined,
	);

	useEffect(() => {
		if (value instanceof File) {
			const objectUrl = URL.createObjectURL(value);
			setPreview(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
		if (typeof value === "string") {
			setPreview(value);
			setImageLoading(true);
		} else {
			setPreview(undefined);
		}
	}, [value]);

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		actions.clearFiles();
		onChange?.(undefined);
		setUploadError(null);
	};

	const hasImage = !!preview;

	return (
		<div className={cn("w-full space-y-4", className)}>
			<div
				className={cn(
					"group relative overflow-hidden rounded-xl transition-all duration-200 border",
					state.isDragging
						? "border-dashed border-primary bg-primary/5"
						: hasImage
							? "border-border bg-background hover:border-primary/50 cursor-default"
							: "border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5 cursor-pointer",
					disabled && "opacity-50 cursor-not-allowed",
				)}
				onDragEnter={actions.handleDragEnter}
				onDragLeave={actions.handleDragLeave}
				onDragOver={actions.handleDragOver}
				onDrop={actions.handleDrop}
				onClick={() => !hasImage && !disabled && actions.openFileDialog()}
			>
				<input
					{...actions.getInputProps()}
					disabled={disabled}
					className="sr-only"
				/>

				{hasImage ? (
					<div className="relative aspect-4/3 w-full">
						{imageLoading && (
							<div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
								<div className="flex flex-col items-center gap-2 text-muted-foreground">
									<HugeiconsIcon icon={Image01Icon} className="size-5" />
									<span className="text-xs">Cargando imagen...</span>
								</div>
							</div>
						)}

						<img
							src={preview}
							alt="Preview"
							className={cn(
								"h-full w-full object-cover transition-opacity duration-300",
								imageLoading ? "opacity-0" : "opacity-100",
							)}
							onLoad={() => setImageLoading(false)}
							onError={() => setImageLoading(false)}
						/>

						{!disabled && (
							<div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
								<div className="flex gap-2">
									<Button
										onClick={(e) => {
											e.stopPropagation();
											actions.openFileDialog();
										}}
										variant="secondary"
										size="sm"
										className="bg-white/90 text-zinc-900 hover:bg-white shadow-sm"
										type="button"
									>
										<HugeiconsIcon icon={Upload01Icon} className="size-3.5" />
										Cambiar
									</Button>
									<Button
										onClick={handleRemove}
										variant="destructive"
										size="sm"
										className="shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90"
										type="button"
									>
										<HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
										Eliminar
									</Button>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="flex aspect-4/3 w-full flex-col items-center justify-center gap-4 p-8 text-center">
						<div className="rounded-full bg-primary/10 p-4">
							<HugeiconsIcon
								icon={CloudUploadIcon}
								className="size-8 text-primary"
							/>
						</div>

						<div className="space-y-1">
							<h3 className="text-base font-semibold text-foreground">
								{label}
							</h3>
							<p className="text-sm text-muted-foreground">
								Arrastra y suelta una imagen aquí, o haz clic para buscar
							</p>
							<p className="text-xs text-muted-foreground/60">
								Tamaño recomendado: 1200x900px • Máx. {formatBytes(maxSize)}
							</p>
						</div>

						<Button
							variant="outline"
							size="sm"
							type="button"
							disabled={disabled}
						>
							<HugeiconsIcon icon={Image01Icon} className="size-3.5" />
							Seleccionar Imagen
						</Button>
					</div>
				)}
			</div>

			{state.errors.length > 0 && (
				<Alert
					variant="destructive"
					className="animate-in fade-in slide-in-from-top-1"
				>
					<AlertIcon>
						<HugeiconsIcon icon={Alert01Icon} />
					</AlertIcon>
					<AlertContent>
						<AlertTitle>Error de archivo</AlertTitle>
						<AlertDescription>
							{state.errors.map((error, index) => (
								<p key={index}>{error}</p>
							))}
						</AlertDescription>
					</AlertContent>
				</Alert>
			)}

			{uploadError && (
				<Alert
					variant="destructive"
					className="animate-in fade-in slide-in-from-top-1"
				>
					<AlertIcon>
						<HugeiconsIcon icon={Alert01Icon} />
					</AlertIcon>
					<AlertContent>
						<AlertTitle>Error al subir</AlertTitle>
						<AlertDescription className="space-y-3">
							<p>{uploadError}</p>
						</AlertDescription>
					</AlertContent>
				</Alert>
			)}
		</div>
	);
}
