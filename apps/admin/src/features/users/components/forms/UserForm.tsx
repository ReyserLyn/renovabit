import {
	KeyGeneratorFobIcon,
	ViewIcon,
	ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import {
	defaultUserFormValues,
	defaultUserUpdateFormValues,
	generateSecurePassword,
	getRoleLabel,
	type UserFormValues,
	type UserUpdateFormValues,
	userFormSchema,
	userUpdateFormSchema,
} from "../../model/user-model";

const formId = "user-form";

function serializeForDirtyCompare(
	values: Partial<UserFormValues> | Partial<UserUpdateFormValues> | undefined,
): string {
	if (!values) return "";

	const normalized: Record<string, unknown> = {};

	if ("name" in values) normalized.name = values.name?.trim() ?? "";
	if ("email" in values) normalized.email = values.email?.trim() ?? "";
	if ("phone" in values) normalized.phone = values.phone?.trim() || null;
	if ("username" in values)
		normalized.username = values.username?.trim() || null;
	if ("displayUsername" in values)
		normalized.displayUsername = values.displayUsername?.trim() || null;
	if ("role" in values) normalized.role = values.role;

	if ("password" in values && values.password) {
		normalized.password = values.password;
	}
	if ("confirmPassword" in values && values.confirmPassword) {
		normalized.confirmPassword = values.confirmPassword;
	}

	return JSON.stringify(normalized);
}

type UserFormProps = {
	isEditing?: boolean;
	initialValues?: Partial<UserFormValues> | Partial<UserUpdateFormValues>;
	onSubmit: (values: UserFormValues | UserUpdateFormValues) => Promise<void>;
	onCancel: () => void;
	isPending?: boolean;
	submitLabel: string;
	onDirtyChange?: (dirty: boolean) => void;
};

export function UserForm({
	isEditing = false,
	initialValues,
	onSubmit,
	onCancel,
	isPending,
	submitLabel,
	onDirtyChange,
}: UserFormProps) {
	const schema = useMemo(
		() => (isEditing ? userUpdateFormSchema : userFormSchema),
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
		} as UserFormValues | UserUpdateFormValues,
		validators: {
			onChange: schema,
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	const initialSnapshotRef = useRef(
		serializeForDirtyCompare(initialValues ?? defaultValues),
	);
	const lastReportedDirtyRef = useRef<boolean>(false);

	const serializedInitialValues = useMemo(
		() => serializeForDirtyCompare(initialValues),
		[
			initialValues?.name,
			initialValues?.email,
			initialValues?.phone,
			initialValues?.username,
			initialValues?.displayUsername,
			initialValues?.role,
			"password" in (initialValues ?? {})
				? (initialValues as UserFormValues)?.password
				: undefined,
			"confirmPassword" in (initialValues ?? {})
				? (initialValues as UserFormValues)?.confirmPassword
				: undefined,
		],
	);

	useEffect(() => {
		if (initialValues) {
			form.reset({
				...defaultValues,
				...initialValues,
			} as UserFormValues | UserUpdateFormValues);
			initialSnapshotRef.current = serializedInitialValues;
			lastReportedDirtyRef.current = false;
		}
	}, [serializedInitialValues, defaultValues]);

	const currentValues = useStore(form.store, (state) => state.values);
	const currentRole = useStore(
		form.store,
		(state) => (state.values as UserFormValues | UserUpdateFormValues).role,
	);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		const snapshot = serializeForDirtyCompare(
			currentValues as Partial<UserFormValues> | Partial<UserUpdateFormValues>,
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
										Nombre{" "}
										{!isEditing && <span className="text-destructive">*</span>}
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										placeholder="Nombre completo"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										required={!isEditing}
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
						name="email"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Correo electrónico{" "}
										{!isEditing && <span className="text-destructive">*</span>}
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										type="email"
										placeholder="usuario@ejemplo.com"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										required={!isEditing}
										autoComplete="email"
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

				{!isEditing && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.Field
							name="password"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								const errorId = getFieldErrorId(formId, field.name);
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={`${formId}-${field.name}`}>
											Contraseña <span className="text-destructive">*</span>
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
													required
													minLength={8}
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
													const newPassword = generateSecurePassword(
														currentRole || "customer",
													);
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
											Repetir contraseña{" "}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<div className="relative">
											<Input
												id={`${formId}-${field.name}`}
												name={field.name}
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Repite la contraseña"
												value={field.state.value || ""}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												disabled={isPending}
												required
												minLength={8}
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
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
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
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="displayUsername"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Usuario
									</FieldLabel>
									<FieldDescription>
										Una sola palabra, como se verá (ej. RenovaBit)
									</FieldDescription>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										placeholder="RenovaBit"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										disabled={isPending}
										autoComplete="username"
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

					<Field>
						<FieldLabel>Usuario único (para login)</FieldLabel>
						<FieldDescription>
							Se usa para iniciar sesión con @usuario
						</FieldDescription>
						<Input
							disabled
							value={
								(
									(currentValues as { displayUsername?: string })
										?.displayUsername ?? ""
								)
									.trim()
									.split(/\s+/)[0]
									?.toLowerCase() || "—"
							}
							className="bg-muted font-mono text-muted-foreground"
							aria-readonly
						/>
					</Field>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="phone"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Teléfono
									</FieldLabel>
									<Input
										id={`${formId}-${field.name}`}
										name={field.name}
										type="tel"
										placeholder="Opcional"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
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
						name="role"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							const errorId = getFieldErrorId(formId, field.name);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={`${formId}-${field.name}`}>
										Rol
									</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={(value) =>
											field.handleChange(
												value as "admin" | "distributor" | "customer",
											)
										}
										disabled={isPending}
									>
										<SelectTrigger
											id={`${formId}-${field.name}`}
											aria-invalid={isInvalid}
											aria-describedby={isInvalid ? errorId : undefined}
										>
											<SelectValue placeholder="Selecciona un rol">
												{getRoleLabel(field.state.value)}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="admin">
												{getRoleLabel("admin")}
											</SelectItem>
											<SelectItem value="distributor">
												{getRoleLabel("distributor")}
											</SelectItem>
											<SelectItem value="customer">
												{getRoleLabel("customer")}
											</SelectItem>
										</SelectContent>
									</Select>
									<FieldDescription className="text-xs text-muted-foreground">
										El rol define el nivel de acceso: Administrador &gt;
										Distribuidor &gt; Cliente.
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
