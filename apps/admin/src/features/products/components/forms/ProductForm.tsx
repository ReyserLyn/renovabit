import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@renovabit/ui/components/ui/field";
import { Input } from "@renovabit/ui/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renovabit/ui/components/ui/select";
import { Spinner } from "@renovabit/ui/components/ui/spinner";
import { Textarea } from "@renovabit/ui/components/ui/textarea";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useRef } from "react";
import { ImageUpload } from "@/components/forms/image-upload";
import { ACCEPT_IMAGE_STRING } from "@/constants/file-upload";
import { useBrands } from "@/features/brands/hooks";

import { useCategories } from "@/features/categories/hooks";

import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import { slugify } from "@/libs/slugify";
import {
	defaultProductFormValues,
	type ProductFormValues,
	ProductFormValuesSchema,
	type ProductSpecificationEntry,
	STATUS_LABELS,
} from "../../models/product-model";

const formId = "product-form";

function serializeForDirtyCompare(
	values: Partial<ProductFormValues> | undefined,
): string {
	if (!values) return "";
	const { images, ...rest } = values;
	const safeImages = Array.isArray(images)
		? images.map((img) => ({
				url: img?.url ?? "",
				alt: img?.alt ?? "",
				order: img?.order ?? 0,
			}))
		: [];
	return JSON.stringify({ ...rest, images: safeImages });
}

function updateSpecificationEntries(
	entries: ProductSpecificationEntry[],
	id: string,
	patch: Partial<Pick<ProductSpecificationEntry, "key" | "value">>,
): ProductSpecificationEntry[] {
	return entries.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function removeSpecificationEntry(
	entries: ProductSpecificationEntry[],
	id: string,
): ProductSpecificationEntry[] {
	return entries.filter((item) => item.id !== id);
}

function addEmptySpecification(
	entries: ProductSpecificationEntry[],
): ProductSpecificationEntry[] {
	return [
		...entries,
		{
			id: `spec-${Date.now()}`,
			key: "",
			value: "",
		},
	];
}

type ProductFormProps = {
	initialValues?: Partial<ProductFormValues>;
	onSubmit: (values: ProductFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
	onDirtyChange?: (dirty: boolean) => void;
};

export function ProductForm({
	initialValues,
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
	onDirtyChange,
}: ProductFormProps) {
	const slugManuallyEditedRef = useRef(false);
	const { data: brandsData = [] } = useBrands(true);
	const { data: categoriesData = [] } = useCategories(true);

	const brands = brandsData.filter((b) => b.isActive);
	const categories = categoriesData.filter((c) => c.isActive);

	const form = useForm({
		defaultValues: {
			...defaultProductFormValues,
			...initialValues,
		},
		validators: {
			onChange: ProductFormValuesSchema,
			onSubmit: ProductFormValuesSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
			slugManuallyEditedRef.current = false;
		},
	});

	const initialSnapshotRef = useRef(
		serializeForDirtyCompare(initialValues ?? defaultProductFormValues),
	);
	const lastReportedDirtyRef = useRef<boolean>(false);

	useEffect(() => {
		if (initialValues) {
			form.reset({
				...defaultProductFormValues,
				...initialValues,
			});
			slugManuallyEditedRef.current = false;
			initialSnapshotRef.current = serializeForDirtyCompare(initialValues);
			lastReportedDirtyRef.current = false;
		}
	}, [JSON.stringify(initialValues)]);

	const currentValues = useStore(form.store, (state) => state.values);

	useEffect(() => {
		const snapshot = serializeForDirtyCompare(
			currentValues as Partial<ProductFormValues>,
		);
		const dirty = snapshot !== initialSnapshotRef.current;
		if (dirty !== lastReportedDirtyRef.current) {
			lastReportedDirtyRef.current = dirty;
			onDirtyChange?.(dirty);
		}
	}, [currentValues, onDirtyChange]);

	return (
		<form
			id={formId}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			noValidate
			className="grid gap-6 overflow-y-auto max-h-[70vh] px-1"
		>
			<FieldGroup>
				{/* Información Básica */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="name"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Nombre
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										autoComplete="off"
										placeholder="Nombre del producto…"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => {
											const v = e.target.value;
											field.handleChange(v);
											if (!slugManuallyEditedRef.current) {
												form.setFieldValue("slug", slugify(v));
											}
										}}
										disabled={isPending}
										aria-invalid={isInvalid}
										aria-describedby={isInvalid ? errorId : undefined}
									/>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>

					<form.Field
						name="slug"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Slug
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										autoComplete="off"
										spellCheck={false}
										placeholder="slug-del-producto…"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => {
											slugManuallyEditedRef.current = true;
											field.handleChange(e.target.value);
										}}
										disabled={isPending}
										className="font-mono text-sm"
										aria-invalid={isInvalid}
										aria-describedby={isInvalid ? errorId : undefined}
									/>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>
				</div>

				<form.Field
					name="sku"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={`${formId}-${field.name}`}>SKU</FieldLabel>
								<Input
									id={`${formId}-${field.name}`}
									name={field.name}
									autoComplete="off"
									spellCheck={false}
									placeholder="SKU único del producto…"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
									className="font-mono text-sm"
									aria-invalid={isInvalid}
									aria-describedby={isInvalid ? errorId : undefined}
								/>
								{isInvalid && (
									<FieldError
										id={errorId}
										errors={normalizeFieldErrors(field.state.meta.errors)}
									/>
								)}
							</Field>
						);
					}}
				/>

				<form.Field
					name="description"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={`${formId}-${field.name}`}>
									Descripción
								</FieldLabel>
								<Textarea
									id={`${formId}-${field.name}`}
									name={field.name}
									autoComplete="off"
									placeholder="Descripción del producto…"
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
									className="resize-none"
									aria-invalid={isInvalid}
									aria-describedby={isInvalid ? errorId : undefined}
								/>
								{isInvalid && (
									<FieldError
										id={errorId}
										errors={normalizeFieldErrors(field.state.meta.errors)}
									/>
								)}
							</Field>
						);
					}}
				/>

				{/* Organización */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="categoryId"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Categoría
									</FieldLabel>
									<Select
										value={field.state.value ?? "none"}
										onValueChange={(val) => {
											if (val === "none" || val === null) {
												field.handleChange(undefined);
											} else {
												field.handleChange(val);
											}
										}}
										disabled={isPending}
									>
										<SelectTrigger
											id={`${formId}-${field.name}`}
											size="default"
											className="w-full"
										>
											<SelectValue placeholder="Seleccionar categoría">
												{field.state.value && field.state.value !== "none"
													? categories.find((c) => c.id === field.state.value)
															?.name
													: "Seleccionar categoría"}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">Sin categoría</SelectItem>
											{categories.map((cat) => (
												<SelectItem key={cat.id} value={cat.id}>
													{cat.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>

					<form.Field
						name="brandId"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Marca
									</FieldLabel>
									<Select
										value={field.state.value ?? "none"}
										onValueChange={(val) => {
											if (val === "none" || val === null) {
												field.handleChange(undefined);
											} else {
												field.handleChange(val);
											}
										}}
										disabled={isPending}
									>
										<SelectTrigger
											id={`${formId}-${field.name}`}
											size="default"
											className="w-full"
										>
											<SelectValue placeholder="Seleccionar marca">
												{field.state.value && field.state.value !== "none"
													? brands.find((b) => b.id === field.state.value)?.name
													: "Seleccionar marca"}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">Sin marca</SelectItem>
											{brands.map((brand) => (
												<SelectItem key={brand.id} value={brand.id}>
													{brand.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>
				</div>

				{/* Inventario y Precio */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<form.Field
						name="price"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Precio (S/)
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										type="number"
										inputMode="decimal"
										step={0.01}
										min={0}
										autoComplete="off"
										placeholder="0.00"
										value={field.state.value}
										onFocus={(e) => e.target.select()}
										onBlur={() => {
											field.handleBlur();
											const n = Number.parseFloat(field.state.value);
											if (!Number.isNaN(n) && n >= 0)
												field.handleChange(n.toFixed(2));
										}}
										onChange={(e) => {
											const v = e.target.value;
											field.handleChange(v === "" ? "0.00" : v);
										}}
										disabled={isPending}
										aria-invalid={isInvalid}
										aria-describedby={isInvalid ? errorId : undefined}
									/>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>

					<form.Field
						name="stock"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Stock
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										type="number"
										min={0}
										value={field.state.value}
										onFocus={(e) => e.target.select()}
										onBlur={field.handleBlur}
										onChange={(e) => {
											const v = e.target.value;
											const n =
												v === "" ? 0 : Math.max(0, Math.floor(Number(v)) || 0);
											field.handleChange(Number.isNaN(n) ? 0 : n);
										}}
										disabled={isPending}
										aria-invalid={isInvalid}
										aria-describedby={isInvalid ? errorId : undefined}
									/>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>

					<form.Field
						name="status"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Estado
									</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={(val) => {
											if (val !== null) {
												field.handleChange(val);
											}
										}}
										disabled={isPending}
									>
										<SelectTrigger
											id={`${formId}-${field.name}`}
											size="default"
										>
											<SelectValue placeholder="Seleccionar estado">
												{field.state.value
													? STATUS_LABELS[field.state.value]
													: null}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">
												{STATUS_LABELS.active}
											</SelectItem>
											<SelectItem value="inactive">
												{STATUS_LABELS.inactive}
											</SelectItem>
											<SelectItem value="out_of_stock">
												{STATUS_LABELS.out_of_stock}
											</SelectItem>
										</SelectContent>
									</Select>
									{isInvalid && (
										<FieldError
											id={errorId}
											errors={normalizeFieldErrors(field.state.meta.errors)}
										/>
									)}
								</Field>
							);
						}}
					/>
				</div>

				{/* Producto Destacado */}
				<form.Field
					name="isFeatured"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field orientation="horizontal" data-invalid={isInvalid}>
								<Checkbox
									id={`${formId}-${field.name}`}
									checked={field.state.value}
									onCheckedChange={(checked) =>
										field.handleChange(checked === true)
									}
									disabled={isPending}
								/>
								<FieldLabel
									htmlFor={`${formId}-${field.name}`}
									className="font-normal"
								>
									Producto Destacado
								</FieldLabel>
							</Field>
						);
					}}
				/>

				{/* Imágenes */}
				<form.Field
					name="images"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Imágenes del Producto</FieldLabel>
								<FieldDescription>
									Máximo 5 imágenes. La primera será la imagen principal.
								</FieldDescription>
								<div className="space-y-3 mt-2">
									{field.state.value.map((img, index) => (
										<div key={index}>
											<ImageUpload
												accept={ACCEPT_IMAGE_STRING}
												value={img.file || img.url}
												onChange={(val: string | File | undefined) => {
													field.handleBlur();
													if (val === undefined) {
														const newImages = field.state.value.filter(
															(_, i) => i !== index,
														);
														field.handleChange(newImages);
														return;
													}
													const newImages = [...field.state.value];
													if (val instanceof File) {
														newImages[index] = {
															...newImages[index],
															file: val,
															url: undefined,
															order: newImages[index]?.order ?? index,
														};
													} else if (typeof val === "string") {
														newImages[index] = {
															...newImages[index],
															url: val,
															file: undefined,
															order: newImages[index]?.order ?? index,
														};
													}
													field.handleChange(newImages);
												}}
												disabled={isPending}
											/>
										</div>
									))}
									{field.state.value.length < 5 && (
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												field.handleChange([
													...field.state.value,
													{
														alt: "",
														order: field.state.value.length,
													},
												]);
											}}
											disabled={isPending}
										>
											<HugeiconsIcon icon={Add01Icon} className="mr-2 size-3" />
											Agregar Imagen
										</Button>
									)}
								</div>
								{isInvalid && (
									<FieldError
										id={errorId}
										errors={normalizeFieldErrors(field.state.meta.errors)}
									/>
								)}
							</Field>
						);
					}}
				/>

				{/* Especificaciones */}
				<form.Field
					name="specifications"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						const entries = field.state.value ?? [];

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Especificaciones técnicas</FieldLabel>
								<FieldDescription>
									Nombre y valor (ej: Color → Negro, Material → Algodón).
									Opcional.
								</FieldDescription>
								<div className="space-y-2 mt-2">
									{entries.map((entry) => (
										<div key={entry.id} className="flex gap-2 items-center">
											<Input
												placeholder="Característica"
												value={entry.key}
												onChange={(e) => {
													field.handleChange(
														updateSpecificationEntries(entries, entry.id, {
															key: e.target.value,
														}),
													);
												}}
												disabled={isPending}
												className="flex-1 min-w-0"
											/>
											<span
												className="text-muted-foreground shrink-0"
												aria-hidden="true"
											>
												→
											</span>
											<Input
												placeholder="Valor"
												value={entry.value}
												onChange={(e) => {
													field.handleChange(
														updateSpecificationEntries(entries, entry.id, {
															value: e.target.value,
														}),
													);
												}}
												disabled={isPending}
												className="flex-1 min-w-0"
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => {
													field.handleChange(
														removeSpecificationEntry(entries, entry.id),
													);
												}}
												disabled={isPending}
												aria-label="Quitar especificación"
											>
												<HugeiconsIcon icon={Delete02Icon} className="size-4" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											field.handleChange(addEmptySpecification(entries));
										}}
										disabled={isPending}
									>
										<HugeiconsIcon icon={Add01Icon} className="mr-2 size-3.5" />
										Agregar especificación
									</Button>
								</div>
								{isInvalid && (
									<FieldError
										id={errorId}
										errors={normalizeFieldErrors(field.state.meta.errors)}
									/>
								)}
							</Field>
						);
					}}
				/>
			</FieldGroup>

			<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 sticky bottom-0 bg-background pt-4 pb-2">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isPending}
				>
					Cancelar
				</Button>
				<Button type="submit" disabled={isPending} aria-busy={isPending}>
					{isPending ? (
						<>
							<Spinner className="size-4 shrink-0" aria-hidden />
							<span aria-live="polite">Guardando…</span>
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</form>
	);
}
