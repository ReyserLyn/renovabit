import {
	KeyGeneratorFobIcon,
	ViewIcon,
	ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { deriveUsername } from "@renovabit/db/schema";
import { Button } from "@renovabit/ui/components/ui/button";
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
import { type AnyFieldApi, useForm, useStore } from "@tanstack/react-form";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import {
	defaultUserFormValues,
	defaultUserUpdateFormValues,
	generateSecurePassword,
	getRoleLabel,
	USER_ROLE_VALUES,
	type UserFormValues,
	UserFormValuesSchema,
	type UserUpdateFormValues,
	UserUpdateFormValuesSchema,
} from "../../model/user-model";

const formId = "user-form";

/**
 * Normaliza los valores para la comparación de "sucio" (dirty check).
 * Ignora espacios adicionales y trata strings vacíos como null para campos opcionales.
 */
function serializeForDirtyCompare(
	values: Partial<UserFormValues> | Partial<UserUpdateFormValues>,
): string {
	if (!values) return "";

	const trim = (v?: string | null) => v?.trim() ?? "";
	const trimOrNull = (v?: string | null) => v?.trim() || null;

	const normalized: Record<string, unknown> = {};

	if ("name" in values) normalized.name = trim(values.name);
	if ("email" in values) normalized.email = trim(values.email);
	if ("phone" in values) normalized.phone = trimOrNull(values.phone);
	if ("displayUsername" in values)
		normalized.displayUsername = trimOrNull(values.displayUsername);
	if ("role" in values) normalized.role = values.role;

	if ("password" in values && values.password)
		normalized.password = values.password;
	if ("confirmPassword" in values && values.confirmPassword)
		normalized.confirmPassword = values.confirmPassword;

	return JSON.stringify(normalized);
}

interface CommonFormFieldProps {
	field: AnyFieldApi;
	label: string;
	description?: string;
	required?: boolean;
	children: (props: {
		id: string;
		isInvalid: boolean;
		errorId: string;
	}) => ReactNode;
}

/**
 * Componente interno para reducir el boilerplate de cada campo del formulario.
 */
function FormFieldWrapper({
	field,
	label,
	description,
	required,
	children,
}: CommonFormFieldProps) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const errorId = getFieldErrorId(formId, field.name);

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={`${formId}-${field.name}`}>
				{label} {required && <span className="text-destructive">*</span>}
			</FieldLabel>
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

type UserFormProps = {
	isEditing?: boolean;
	/** Valores iniciales al abrir el formulario. Para edición, solo se resetea cuando initialValuesKey cambia. */
	initialValues?: Partial<UserFormValues> | Partial<UserUpdateFormValues>;
	/** Clave estable (ej. user.id) para evitar resets por cambios de referencia en initialValues. */
	initialValuesKey?: string;
	onSubmit: (values: UserFormValues | UserUpdateFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
	onDirtyChange?: (dirty: boolean) => void;
};

export function UserForm({
	isEditing = false,
	initialValues,
	initialValuesKey,
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
	onDirtyChange,
}: UserFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const schema = useMemo(
		() => (isEditing ? UserUpdateFormValuesSchema : UserFormValuesSchema),
		[isEditing],
	);
	const defaultValues = useMemo(
		() => (isEditing ? defaultUserUpdateFormValues : defaultUserFormValues),
		[isEditing],
	);

	const form = useForm({
		defaultValues: {
			...defaultValues,
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

	// Gestión de estado "dirty"
	const initialSnapshotRef = useRef(
		serializeForDirtyCompare(initialValues ?? defaultValues),
	);
	const lastReportedDirtyRef = useRef<boolean>(false);

	const currentValues = useStore(form.store, (state) => state.values);
	const currentRole = useStore(form.store, (state) => {
		const role = state.values.role;
		return USER_ROLE_VALUES.find((r) => r === role) ?? "customer";
	});

	useEffect(() => {
		const snapshot = serializeForDirtyCompare(currentValues);
		const dirty = snapshot !== initialSnapshotRef.current;
		if (dirty !== lastReportedDirtyRef.current) {
			lastReportedDirtyRef.current = dirty;
			onDirtyChange?.(dirty);
		}
	}, [currentValues, onDirtyChange]);

	// Resetear solo al cambiar de usuario/create (evita reset por cambio de referencia de initialValues)
	const lastKeyRef = useRef<string | null>(null);
	useEffect(() => {
		const key = initialValuesKey ?? (initialValues ? "init" : null);
		if (key !== null && key !== lastKeyRef.current) {
			lastKeyRef.current = key;
			const values = { ...defaultValues, ...initialValues };
			form.reset(values);
			initialSnapshotRef.current = serializeForDirtyCompare(values);
			lastReportedDirtyRef.current = false;
		}
	}, [initialValues, initialValuesKey, defaultValues, form.reset]);

	const usernamePreview = useMemo(
		() => deriveUsername(currentValues.displayUsername) ?? "—",
		[currentValues.displayUsername],
	);

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
						children={(field) => (
							<FormFieldWrapper
								field={field}
								label="Nombre"
								required={!isEditing}
							>
								{(props) => (
									<Input
										{...props}
										name={field.name}
										placeholder="Nombre completo"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
									/>
								)}
							</FormFieldWrapper>
						)}
					/>

					<form.Field
						name="email"
						children={(field) => (
							<FormFieldWrapper
								field={field}
								label="Correo electrónico"
								required={!isEditing}
							>
								{(props) => (
									<Input
										{...props}
										name={field.name}
										type="email"
										placeholder="usuario@ejemplo.com"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										autoComplete="email"
									/>
								)}
							</FormFieldWrapper>
						)}
					/>
				</div>

				{!isEditing && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.Field
							name="password"
							children={(field) => (
								<FormFieldWrapper field={field} label="Contraseña" required>
									{(props) => (
										<div className="flex gap-2">
											<div className="relative flex-1">
												<Input
													{...props}
													type={showPassword ? "text" : "password"}
													placeholder="Mínimo 8 caracteres"
													value={field.state.value || ""}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													disabled={isPending}
													autoComplete="new-password"
													className="pr-10"
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
													onClick={() => setShowPassword(!showPassword)}
													disabled={isPending}
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
													const pwd = generateSecurePassword(currentRole);
													field.handleChange(pwd);
													form.setFieldValue("confirmPassword", pwd);
												}}
												disabled={isPending}
												title="Generar contraseña"
											>
												<HugeiconsIcon
													icon={KeyGeneratorFobIcon}
													className="size-4"
												/>
											</Button>
										</div>
									)}
								</FormFieldWrapper>
							)}
						/>

						<form.Field
							name="confirmPassword"
							children={(field) => (
								<FormFieldWrapper
									field={field}
									label="Repetir contraseña"
									required
								>
									{(props) => (
										<div className="relative">
											<Input
												{...props}
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Repite la contraseña"
												value={field.state.value || ""}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												disabled={isPending}
												autoComplete="new-password"
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
												disabled={isPending}
											>
												<HugeiconsIcon
													icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
													className="size-4"
												/>
											</Button>
										</div>
									)}
								</FormFieldWrapper>
							)}
						/>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="displayUsername"
						children={(field) => (
							<FormFieldWrapper
								field={field}
								label="Usuario"
								description="Una sola palabra (ej. RenovaBit)"
								required={!isEditing}
							>
								{(props) => (
									<Input
										{...props}
										placeholder="RenovaBit"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										autoComplete="username"
									/>
								)}
							</FormFieldWrapper>
						)}
					/>

					<Field>
						<FieldLabel>Usuario único (login)</FieldLabel>
						<FieldDescription>Se usa para iniciar sesión</FieldDescription>
						<Input
							disabled
							value={usernamePreview}
							className="bg-muted font-mono text-muted-foreground"
						/>
					</Field>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="phone"
						children={(field) => (
							<FormFieldWrapper field={field} label="Teléfono">
								{(props) => (
									<Input
										{...props}
										type="tel"
										placeholder="Opcional"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
									/>
								)}
							</FormFieldWrapper>
						)}
					/>

					<form.Field
						name="role"
						children={(field) => (
							<FormFieldWrapper field={field} label="Rol">
								{(props) => (
									<Select
										value={field.state.value}
										onValueChange={(val) => {
											const role = USER_ROLE_VALUES.find((r) => r === val);
											if (role) field.handleChange(role);
										}}
										disabled={isPending}
									>
										<SelectTrigger {...props}>
											<SelectValue placeholder="Selecciona un rol">
												{getRoleLabel(
													USER_ROLE_VALUES.find(
														(r) => r === field.state.value,
													) ?? "customer",
												)}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{USER_ROLE_VALUES.map((role) => (
												<SelectItem key={role} value={role}>
													{getRoleLabel(role)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</FormFieldWrapper>
						)}
					/>
				</div>
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
				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<>
							<Spinner className="size-4 shrink-0" />
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
