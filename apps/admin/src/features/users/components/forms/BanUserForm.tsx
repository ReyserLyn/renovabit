import { Button } from "@renovabit/ui/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@renovabit/ui/components/ui/field";
import { Input } from "@renovabit/ui/components/ui/input";
import { Spinner } from "@renovabit/ui/components/ui/spinner";
import { Textarea } from "@renovabit/ui/components/ui/textarea";
import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import {
	type BanUserFormValues,
	BanUserFormValuesSchema,
	defaultBanUserFormValues,
} from "../../model/user-model";

const formId = "ban-user-form";

interface FormFieldWrapperProps {
	field: AnyFieldApi;
	label: string;
	description?: string;
	children: (props: {
		id: string;
		isInvalid: boolean;
		errorId: string;
	}) => ReactNode;
}

function FormFieldWrapper({
	field,
	label,
	description,
	children,
}: FormFieldWrapperProps) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const errorId = getFieldErrorId(formId, field.name);

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={`${formId}-${field.name}`}>{label}</FieldLabel>
			{description && <FieldDescription>{description}</FieldDescription>}
			{children({ id: `${formId}-${field.name}`, isInvalid, errorId })}
			{isInvalid && (
				<FieldError
					id={errorId}
					errors={normalizeFieldErrors(field.state.meta.errors)}
				/>
			)}
		</Field>
	);
}

type BanUserFormProps = {
	onSubmit: (values: BanUserFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
};

export function BanUserForm({
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
}: BanUserFormProps) {
	const form = useForm({
		defaultValues: defaultBanUserFormValues,
		validators: {
			onChange: BanUserFormValuesSchema,
			onSubmit: BanUserFormValuesSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

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
					name="banReason"
					children={(field) => (
						<FormFieldWrapper
							field={field}
							label="Motivo del baneo"
							description="Este motivo será visible para el usuario al intentar iniciar sesión."
						>
							{(props) => (
								<Textarea
									{...props}
									name={field.name}
									placeholder="Describe el motivo del baneo..."
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
									className="min-h-[100px] resize-none"
								/>
							)}
						</FormFieldWrapper>
					)}
				/>

				<form.Field
					name="banExpiresIn"
					children={(field) => (
						<FormFieldWrapper
							field={field}
							label="Duración (en segundos)"
							description="Use 0 para baneo permanente. Número positivo para segundos hasta que expire."
						>
							{(props) => (
								<Input
									{...props}
									name={field.name}
									type="number"
									min={0}
									placeholder="0 = permanente"
									value={
										field.state.value === 0 ? "" : String(field.state.value)
									}
									onBlur={field.handleBlur}
									onChange={(e) => {
										const raw = e.target.value;
										const num = raw === "" ? 0 : Number.parseInt(raw, 10);
										field.handleChange(Number.isNaN(num) ? 0 : num);
									}}
									disabled={isPending}
								/>
							)}
						</FormFieldWrapper>
					)}
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
				<Button
					type="submit"
					variant="destructive"
					disabled={isPending}
					aria-busy={isPending}
				>
					{isPending ? (
						<>
							<Spinner className="size-4 shrink-0" aria-hidden />
							<span>Baneando…</span>
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</form>
	);
}
