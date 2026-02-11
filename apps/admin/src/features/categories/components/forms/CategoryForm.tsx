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
import { cn } from "@renovabit/ui/lib/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useRef } from "react";
import { ImageUpload } from "@/components/forms/image-upload";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import { slugify } from "@/libs/slugify";
import { useCategories } from "../../hooks";
import {
	CategoryFormValues,
	CategoryFormValuesSchema,
	defaultCategoryFormValues,
} from "../../model/category-model";

const formId = "category-form";

type CategoryFormProps = {
	categoryId?: string;
	initialValues?: Partial<CategoryFormValues>;
	onSubmit: (values: CategoryFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
};

export function CategoryForm({
	categoryId,
	initialValues,
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
}: CategoryFormProps) {
	const slugManuallyEditedRef = useRef(false);
	const { data: categories = [] } = useCategories(true);

	const parentOptions = categories.filter((c) => c.id !== categoryId);

	const form = useForm({
		defaultValues: {
			...defaultCategoryFormValues,
			...initialValues,
		},
		validators: {
			onChange: CategoryFormValuesSchema,
			onSubmit: CategoryFormValuesSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
			slugManuallyEditedRef.current = false;
		},
	});

	const isActive = useStore(form.store, (state) => state.values.isActive);

	useEffect(() => {
		if (initialValues) {
			form.reset({
				...defaultCategoryFormValues,
				...initialValues,
			});
			slugManuallyEditedRef.current = false;
		}
	}, [JSON.stringify(initialValues)]);

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
										placeholder="Nombre de la categoría"
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
										placeholder="slug-de-la-categoria"
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
									placeholder="Breve descripción de la categoría..."
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

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="parentId"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Categoría Padre
									</FieldLabel>
									<Select
										value={field.state.value ?? "none"}
										onValueChange={(val) =>
											field.handleChange(val === "none" ? null : val)
										}
										disabled={isPending}
									>
										<SelectTrigger
											id={`${formId}-${field.name}`}
											size="default"
											className="w-full"
										>
											<SelectValue placeholder="Sin padre (Raíz)">
												{field.state.value && field.state.value !== "none"
													? categories.find((c) => c.id === field.state.value)
															?.name
													: "Sin padre (Raíz)"}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">Sin padre (Raíz)</SelectItem>
											{parentOptions.map((cat) => (
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
						name="order"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Orden
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										type="number"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										disabled={isPending}
										aria-invalid={isInvalid}
										aria-describedby={isInvalid ? errorId : undefined}
									/>
									<FieldDescription>
										Orden de posición en listas y menús (0 es el primero).
									</FieldDescription>
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
					name="imageUrl"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={`${formId}-${field.name}`}>
									Imagen de la Categoría
								</FieldLabel>
								<ImageUpload
									label="Imagen de la Categoría"
									value={field.state.value || ""}
									onChange={(val: string | File | undefined) =>
										field.handleChange(val ?? "")
									}
									disabled={isPending}
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

				<div className="flex flex-wrap gap-6 pt-2">
					<form.Field
						name="showInNavbar"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field orientation="horizontal" data-invalid={isInvalid}>
									<Checkbox
										id={`${formId}-${field.name}`}
										checked={isActive ? field.state.value : false}
										onCheckedChange={(checked) =>
											field.handleChange(checked === true)
										}
										disabled={isPending || !isActive}
									/>
									<FieldLabel
										htmlFor={`${formId}-${field.name}`}
										className={cn("font-normal", !isActive && "opacity-50")}
									>
										Mostrar en Navbar
									</FieldLabel>
								</Field>
							);
						}}
					/>

					<form.Field
						name="isActive"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field orientation="horizontal" data-invalid={isInvalid}>
									<Checkbox
										id={`${formId}-${field.name}`}
										checked={field.state.value}
										onCheckedChange={(checked) => {
											const val = checked === true;
											field.handleChange(val);

											if (!val) {
												form.setFieldValue("showInNavbar", false);
											} else {
												form.setFieldValue("showInNavbar", true);
											}
										}}
										disabled={isPending}
									/>
									<FieldLabel
										htmlFor={`${formId}-${field.name}`}
										className="font-normal"
									>
										Categoría activa
									</FieldLabel>
								</Field>
							);
						}}
					/>
				</div>
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
							<span>Guardando…</span>
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</form>
	);
}
