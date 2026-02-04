import { Button } from "@renovabit/ui/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card.tsx";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@renovabit/ui/components/ui/field";
import { Input } from "@renovabit/ui/components/ui/input.tsx";
import { Spinner } from "@renovabit/ui/components/ui/spinner.tsx";
import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import { getFieldErrorId, normalizeFieldErrors } from "@/libs/form-utils";
import { loginSchema } from "../domain/auth-model";
import { useLogin } from "../hooks/use-login";

const formId = "login-form";
const emailId = "login-email";
const passwordId = "login-password";

export function LoginForm() {
	const { loginMutation } = useLogin();
	const errorRef = useRef<HTMLDivElement>(null);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: loginSchema,
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await loginMutation.mutateAsync(value);
			} catch {
				errorRef.current?.focus();
			}
		},
	});

	return (
		<Card
			className="w-full border-border shadow-lg transition-shadow duration-200 focus-within:shadow-xl p-6 sm:p-8"
			size="default"
		>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
					Iniciar sesión
				</CardTitle>
				<CardDescription className="text-muted-foreground text-sm sm:text-base">
					Ingresa tu correo y contraseña para acceder al panel
				</CardDescription>
			</CardHeader>
			<CardContent className="gap-4 flex flex-col">
				<form
					id={formId}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					noValidate
					aria-describedby={loginMutation.isError ? "login-error" : undefined}
					className="flex flex-col gap-5"
				>
					{loginMutation.isError && (
						<div
							id="login-error"
							ref={errorRef}
							role="alert"
							aria-live="polite"
							tabIndex={-1}
							className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive focus:outline-none"
						>
							{loginMutation.error instanceof Error
								? loginMutation.error.message
								: "Error al iniciar sesión. Revisa tu correo y contraseña."}
						</div>
					)}
					<FieldGroup>
						<form.Field
							name="email"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={emailId}>
											Correo electrónico
										</FieldLabel>
										<Input
											id={emailId}
											name={field.name}
											type="email"
											autoComplete="email"
											inputMode="email"
											placeholder="ejemplo@renovabit.com"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={loginMutation.isPending}
											spellCheck={false}
											className="min-w-0"
											aria-invalid={isInvalid}
											aria-describedby={
												isInvalid
													? getFieldErrorId(formId, field.name)
													: undefined
											}
										/>
										{isInvalid && (
											<FieldError
												id={getFieldErrorId(formId, field.name)}
												errors={normalizeFieldErrors(field.state.meta.errors)}
											/>
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="password"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={passwordId}>Contraseña</FieldLabel>
										<Input
											id={passwordId}
											name={field.name}
											type="password"
											autoComplete="current-password"
											placeholder="••••••••"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={loginMutation.isPending}
											className="min-w-0"
											aria-invalid={isInvalid}
											aria-describedby={
												isInvalid
													? getFieldErrorId(formId, field.name)
													: undefined
											}
										/>
										{isInvalid && (
											<FieldError
												id={getFieldErrorId(formId, field.name)}
												errors={normalizeFieldErrors(field.state.meta.errors)}
											/>
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>

				<Field orientation="horizontal" className="w-full">
					<Button
						type="submit"
						form={formId}
						size="lg"
						className="w-full min-h-11 touch-action-manipulation"
						disabled={loginMutation.isPending}
						aria-busy={loginMutation.isPending}
					>
						{loginMutation.isPending ? (
							<>
								<Spinner className="size-4 shrink-0" aria-hidden />
								<span>Iniciando sesión…</span>
							</>
						) : (
							"Entrar"
						)}
					</Button>
				</Field>
			</CardContent>
		</Card>
	);
}
