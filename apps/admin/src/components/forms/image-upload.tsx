import {
	Add01Icon,
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
} from "@renovabit/ui/components/ui/alert";
import { Button } from "@renovabit/ui/components/ui/button";
import { cn } from "@renovabit/ui/lib/utils";
import { Image } from "@unpic/react";
import { useCallback, useEffect, useState } from "react";
import { formatBytes, useFileUpload } from "../../hooks/use-file-upload";

interface BaseProps {
	maxSize?: number;
	accept?: string;
	className?: string;
	label?: string;
	disabled?: boolean;
	maxFiles?: number;
}

interface SingleUploadProps extends BaseProps {
	multiple?: false;
	value?: string | File;
	onChange?: (value: File | string | undefined) => void;
}

interface MultipleUploadProps extends BaseProps {
	multiple: true;
	value?: (string | File)[];
	onChange?: (value: (File | string)[]) => void;
}

export type ImageUploadProps = SingleUploadProps | MultipleUploadProps;

export function ImageUpload(props: ImageUploadProps) {
	const {
		multiple = false,
		value,
		onChange,
		maxSize = 5 * 1024 * 1024,
		accept = "image/*",
		className,
		label = "Imagen",
		disabled = false,
		maxFiles = multiple ? 10 : 1,
	} = props;

	const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

	const [state, actions] = useFileUpload({
		maxFiles,
		maxSize,
		accept,
		multiple,
		onFilesChange: (files) => {
			if (multiple) {
				const finalFiles = files.map((f) => f.file);
				(onChange as (v: (File | string)[]) => void)?.(
					finalFiles as (File | string)[],
				);
			} else {
				const firstFile = files[0]?.file;
				const valueToEmit =
					firstFile instanceof File ? firstFile : firstFile?.url;

				setTimeout(() => {
					(onChange as (v: File | string | undefined) => void)?.(valueToEmit);
				}, 0);
			}
		},
	});

	// For previewing existing strings or new Files
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		if (multiple) {
			const values = (value as (string | File)[]) || [];
			const urls = values.map((v) => {
				if (v instanceof File) return URL.createObjectURL(v);
				return v;
			});
			setPreviews(urls);
			// Cleanup
			return () => {
				for (const url of urls) {
					if (url.startsWith("blob:")) URL.revokeObjectURL(url);
				}
			};
		} else {
			if (value instanceof File) {
				const objectUrl = URL.createObjectURL(value);
				setPreviews([objectUrl]);
				return () => URL.revokeObjectURL(objectUrl);
			}
			if (typeof value === "string" && value) {
				setPreviews([value]);
			} else {
				setPreviews([]);
			}
		}
	}, [value, multiple]);

	const handleRemoveIndex = useCallback(
		(index: number, e: React.MouseEvent) => {
			e.stopPropagation();
			if (multiple) {
				const current = [...((value as (string | File)[]) || [])];
				current.splice(index, 1);
				(onChange as (v: (File | string)[]) => void)?.(current);
			}
		},
		[multiple, value, onChange],
	);

	// RENDER SINGLE MODE
	if (!multiple) {
		const preview = previews[0];
		return (
			<div className={cn("w-full space-y-4", className)}>
				<div
					className={cn(
						"group relative overflow-hidden rounded-xl transition-all duration-200 border",
						state.isDragging
							? "border-dashed border-primary bg-primary/5"
							: preview
								? "border-border bg-background hover:border-primary/50 cursor-default"
								: "border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5 cursor-pointer",
						disabled && "opacity-50 cursor-not-allowed",
					)}
					onDragEnter={actions.handleDragEnter}
					onDragLeave={actions.handleDragLeave}
					onDragOver={actions.handleDragOver}
					onDrop={actions.handleDrop}
					onClick={() => !preview && !disabled && actions.openFileDialog()}
				>
					<input
						{...actions.getInputProps()}
						disabled={disabled}
						className="sr-only"
					/>

					{preview ? (
						<div className="relative aspect-4/3 w-full">
							{imageLoading[preview] !== false && (
								<div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<HugeiconsIcon icon={Image01Icon} className="size-5" />
										<span className="text-xs">Cargando...</span>
									</div>
								</div>
							)}

							<Image
								src={preview}
								alt="Preview"
								width={800}
								height={600}
								layout="constrained"
								objectFit="contain"
								className={cn(
									"h-full w-full object-contain transition-opacity duration-300",
									imageLoading[preview] === false ? "opacity-100" : "opacity-0",
								)}
								onLoad={() =>
									setImageLoading((prev) => ({ ...prev, [preview]: false }))
								}
								onError={() =>
									setImageLoading((prev) => ({ ...prev, [preview]: false }))
								}
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
											className="bg-white text-zinc-900 hover:bg-white/80 shadow-sm"
											type="button"
										>
											<HugeiconsIcon icon={Upload01Icon} className="size-3.5" />
											Cambiar
										</Button>
										<Button
											onClick={(e) => {
												e.stopPropagation();
												actions.clearFiles();
												(onChange as (v: File | string | undefined) => void)?.(
													undefined,
												);
											}}
											variant="destructive"
											size="sm"
											type="button"
											aria-label="Eliminar imagen"
											className="bg-destructive text-white hover:bg-destructive/80 border-0 shadow-sm"
										>
											<HugeiconsIcon
												icon={Cancel01Icon}
												className="size-3.5 shrink-0"
											/>
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
									Arrastra una imagen o haz clic
								</p>
								<p className="text-xs text-muted-foreground/60">
									Máx. {formatBytes(maxSize)}
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								type="button"
								disabled={disabled}
							>
								<HugeiconsIcon icon={Image01Icon} className="size-3.5" />
								Seleccionar
							</Button>
						</div>
					)}
				</div>
				{/* Errors */}
				{state.errors.length > 0 && <ErrorMessage errors={state.errors} />}
			</div>
		);
	}

	// RENDER MULTIPLE MODE
	return (
		<div className={cn("w-full space-y-4", className)}>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{previews.map((preview, index) => (
					<div
						key={preview}
						className="group relative aspect-square rounded-xl border bg-muted/30 overflow-hidden"
					>
						<Image
							src={preview}
							alt={`Preview ${index}`}
							width={200}
							height={200}
							layout="constrained"
							objectFit="cover"
							className="h-full w-full object-cover"
						/>
						{!disabled && (
							<div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
								<Button
									onClick={(e) => handleRemoveIndex(index, e)}
									variant="destructive"
									size="icon-xs"
									className="size-7 rounded-full"
									type="button"
								>
									<HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
								</Button>
							</div>
						)}
					</div>
				))}

				{previews.length < maxFiles && (
					<div
						className={cn(
							"aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer",
							state.isDragging
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-primary hover:bg-primary/5",
							disabled && "opacity-50 cursor-not-allowed",
						)}
						onDragEnter={actions.handleDragEnter}
						onDragLeave={actions.handleDragLeave}
						onDragOver={actions.handleDragOver}
						onDrop={actions.handleDrop}
						onClick={() => !disabled && actions.openFileDialog()}
					>
						<input
							{...actions.getInputProps()}
							disabled={disabled}
							className="sr-only"
						/>
						<HugeiconsIcon
							icon={Add01Icon}
							className="size-6 text-muted-foreground"
						/>
						<span className="text-[10px] font-medium text-muted-foreground uppercase">
							{label}
						</span>
					</div>
				)}
			</div>
			{state.errors.length > 0 && <ErrorMessage errors={state.errors} />}
		</div>
	);
}

function ErrorMessage({ errors }: { errors: string[] }) {
	return (
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
					{errors.map((error, i) => (
						<p key={i}>{error}</p>
					))}
				</AlertDescription>
			</AlertContent>
		</Alert>
	);
}
