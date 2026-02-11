import {
	KeyGeneratorFobIcon,
	ViewIcon,
	ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@renovabit/ui/components/ui/field";
import { Input } from "@renovabit/ui/components/ui/input";
import { Spinner } from "@renovabit/ui/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import {
	defaultUserPasswordFormValues,
	generateSecurePassword,
	getUserPasswordFormValuesSchema,
	type User,
	type UserPasswordFormValues,
} from "../../model/user-model";

const formId = "user-password-form";

type UserPasswordFormProps = {
	initialValues?: Partial<UserPasswordFormValues>;
	onSubmit: (values: UserPasswordFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
	userRole?: User["role"];
};

export function UserPasswordForm({
	initialValues,
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
	userRole = "customer",
}: UserPasswordFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const schema = useMemo(
		() => getUserPasswordFormValuesSchema(userRole),
		[userRole],
	);

	const form = useForm({
		defaultValues: {
			...defaultUserPasswordFormValues,
			...initialValues,
		},
		validators: {
			onChange: schema,
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	const serializedInitialValues = useMemo(
		() => JSON.stringify(initialValues),
		[initialValues?.password, initialValues?.confirmPassword],
	);

	useEffect(() => {
		if (initialValues) {
			form.reset({
				...defaultUserPasswordFormValues,
				...initialValues,
			});
		}
	}, [serializedInitialValues]);

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
					name="password"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={`${formId}-${field.name}`}>
									Nueva contraseña <span className="text-destructive">*</span>
								</FieldLabel>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<Input
											id={`${formId}-${field.name}`}
											name={field.name}
											type={showPassword ? "text" : "password"}
											placeholder="Mínimo 8 caracteres"
											value={field.state.value || ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={isPending}
											autoComplete="new-password"
											aria-invalid={isInvalid}
											aria-describedby={isInvalid ? errorId : undefined}
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
											disabled={isPending}
											title={
												showPassword
													? "Ocultar contraseña"
													: "Mostrar contraseña"
											}
										>
											<HugeiconsIcon
												icon={showPassword ? ViewOffIcon : ViewIcon}
												className="size-4"
											/>
										</Button>
									</div>
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => {
											const newPassword = generateSecurePassword(userRole);
											field.handleChange(newPassword);
											form.setFieldValue("confirmPassword", newPassword);
										}}
										disabled={isPending}
										title="Generar contraseña segura"
										aria-label="Generar contraseña segura"
									>
										<HugeiconsIcon
											icon={KeyGeneratorFobIcon}
											className="size-4"
										/>
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

				<form.Field
					name="confirmPassword"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						const errorId = getFieldErrorId(formId, field.name);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={`${formId}-${field.name}`}>
									Repetir contraseña <span className="text-destructive">*</span>
								</FieldLabel>
								<div className="relative">
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Repite la nueva contraseña"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										autoComplete="new-password"
										aria-invalid={isInvalid}
										aria-describedby={isInvalid ? errorId : undefined}
										className="pr-10"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										disabled={isPending}
										title={
											showConfirmPassword
												? "Ocultar contraseña"
												: "Mostrar contraseña"
										}
									>
										<HugeiconsIcon
											icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
											className="size-4"
										/>
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
							<span>Cambiando…</span>
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</form>
	);
}
