import { Button } from "@renovabit/ui/components/ui/button.tsx";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox.tsx";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@renovabit/ui/components/ui/field.tsx";
import { Input } from "@renovabit/ui/components/ui/input.tsx";
import { Spinner } from "@renovabit/ui/components/ui/spinner.tsx";
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef } from "react";
import {
	type BrandFormValues,
	brandFormSchema,
	defaultBrandFormValues,
	slugify,
} from "../../model/brand-model";
import UploadImage from "./upload-image";

type BrandFormProps = {
	initialValues?: Partial<BrandFormValues>;
	onSubmit: (values: BrandFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
};

export function BrandForm({
	initialValues,
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
}: BrandFormProps) {
	const slugManuallyEditedRef = useRef(false);

	const form = useForm({
		defaultValues: {
			...defaultBrandFormValues,
			...initialValues,
		},
		validators: {
			onChange: brandFormSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
			slugManuallyEditedRef.current = false;
		},
	});

	useEffect(() => {
		if (initialValues) {
			form.reset({
				...defaultBrandFormValues,
				...initialValues,
			});
			slugManuallyEditedRef.current = false;
		}
	}, [JSON.stringify(initialValues)]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			noValidate
			className="grid gap-6"
		>
			<FieldGroup>
				{/* Campo Nombre */}
				<form.Field name="name">
					{(field) => (
						<Field
							data-invalid={
								field.state.meta.isTouched && !field.state.meta.isValid
							}
						>
							<FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								placeholder="Nombre de la Marca"
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
								aria-invalid={
									field.state.meta.isTouched && !field.state.meta.isValid
								}
							/>
							{field.state.meta.isTouched && !field.state.meta.isValid && (
								<FieldError errors={field.state.meta.errors} />
							)}
						</Field>
					)}
				</form.Field>

				{/* Campo Slug */}
				<form.Field name="slug">
					{(field) => (
						<Field
							data-invalid={
								field.state.meta.isTouched && !field.state.meta.isValid
							}
						>
							<FieldLabel htmlFor={field.name}>Slug</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								placeholder="Slug de la marca"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => {
									slugManuallyEditedRef.current = true;
									field.handleChange(e.target.value);
								}}
								disabled={isPending}
								className="font-mono text-sm"
								aria-invalid={
									field.state.meta.isTouched && !field.state.meta.isValid
								}
							/>
							{field.state.meta.isTouched && !field.state.meta.isValid && (
								<FieldError errors={field.state.meta.errors} />
							)}
						</Field>
					)}
				</form.Field>

				{/* Campo Logo */}
				<form.Field name="logo">
					{(field) => (
						<Field
							data-invalid={
								field.state.meta.isTouched && !field.state.meta.isValid
							}
						>
							<FieldLabel htmlFor={field.name}>Logo de la Marca</FieldLabel>
							<UploadImage
								value={field.state.value}
								onChange={(val: File | string | undefined) =>
									field.handleChange(val)
								}
								disabled={isPending}
							/>
							{field.state.meta.isTouched && !field.state.meta.isValid && (
								<FieldError errors={field.state.meta.errors} />
							)}
						</Field>
					)}
				</form.Field>

				{/* Campo Activo */}
				<form.Field name="isActive">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field orientation="horizontal" data-invalid={isInvalid}>
								<Checkbox
									id={field.name}
									checked={field.state.value}
									onCheckedChange={(checked) =>
										field.handleChange(checked === true)
									}
									disabled={isPending}
									aria-invalid={isInvalid}
								/>
								<FieldLabel htmlFor={field.name} className="font-normal">
									Marca activa
								</FieldLabel>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>

			<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
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
