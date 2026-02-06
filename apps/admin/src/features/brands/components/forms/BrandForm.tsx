import { Button } from "@renovabit/ui/components/ui/button";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@renovabit/ui/components/ui/field";
import { Input } from "@renovabit/ui/components/ui/input";
import { Spinner } from "@renovabit/ui/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef } from "react";
import { ImageUpload } from "@/components/forms/image-upload";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import {
	type BrandFormValues,
	brandFormSchema,
	defaultBrandFormValues,
	slugify,
} from "../../model/brand-model";

const formId = "brand-form";

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
			onSubmit: brandFormSchema,
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
			id={formId}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			noValidate
			className="grid gap-6"
		>
			<FieldGroup>
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
									placeholder="Slug de la marca"
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

				<form.Field
					name="logo"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={`${formId}-${field.name}`}>
									Logo de la Marca
								</FieldLabel>
								<ImageUpload
									label="Logo de la Marca"
									value={field.state.value}
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

				<form.Field
					name="isActive"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field orientation="horizontal" data-invalid={isInvalid}>
								<Checkbox
									id={`${formId}-${field.name}`}
									checked={field.state.value}
									onCheckedChange={(checked) =>
										field.handleChange(checked === true)
									}
									disabled={isPending}
									aria-invalid={isInvalid}
									aria-describedby={isInvalid ? errorId : undefined}
								/>
								<FieldLabel
									htmlFor={`${formId}-${field.name}`}
									className="font-normal"
								>
									Marca activa
								</FieldLabel>
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
