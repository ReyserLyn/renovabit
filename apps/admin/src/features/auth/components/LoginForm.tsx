import { Button } from "@renovabit/ui/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renovabit/ui/components/ui/card.tsx";
import { Input } from "@renovabit/ui/components/ui/input.tsx";
import { Label } from "@renovabit/ui/components/ui/label.tsx";
import { Spinner } from "@renovabit/ui/components/ui/spinner.tsx";
import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import { loginSchema } from "../domain/auth-model";
import { useLogin } from "../hooks/use-login";

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
		onSubmit: async ({ value }) => {
			const parsed = loginSchema.safeParse(value);
			if (!parsed.success) {
				errorRef.current?.focus();
				return;
			}
			try {
				await loginMutation.mutateAsync(parsed.data);
				// La navegación la hace useLogin (onSuccess) tras precargar la sesión en caché
			} catch {
				errorRef.current?.focus();
			}
		},
	});

	return (
		<Card
			className="w-full border-border shadow-lg transition-shadow duration-200 focus-within:shadow-xl"
			size="default"
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				noValidate
				aria-describedby={loginMutation.isError ? "login-error" : undefined}
				className="flex flex-col"
			>
				<CardHeader className="space-y-1.5 px-6 pt-6 pb-2 text-center sm:px-8 sm:pt-8">
					<CardTitle className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
						Iniciar sesión
					</CardTitle>
					<CardDescription className="text-muted-foreground text-sm sm:text-base">
						Ingresa tu correo y contraseña para acceder al panel
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-5 px-6 pb-4 sm:px-8 sm:pb-6">
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
					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) => {
								if (!value?.trim()) return "El correo es obligatorio.";
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
								if (!emailRegex.test(value.trim())) {
									return "Introduce un correo válido.";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={emailId}>Correo electrónico</Label>
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
									aria-invalid={field.state.meta.errors.length > 0}
									aria-describedby={
										field.state.meta.errors.length > 0
											? `${emailId}-error`
											: undefined
									}
								/>
								{field.state.meta.isTouched &&
								field.state.meta.errors.length > 0 ? (
									<p
										id={`${emailId}-error`}
										role="alert"
										className="text-sm text-destructive"
									>
										{field.state.meta.errors.join(", ")}
									</p>
								) : null}
							</div>
						)}
					</form.Field>
					<form.Field
						name="password"
						validators={{
							onChange: ({ value }) => {
								if (!value || value.length === 0) {
									return "La contraseña es obligatoria.";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={passwordId}>Contraseña</Label>
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
									aria-invalid={field.state.meta.errors.length > 0}
									aria-describedby={
										field.state.meta.errors.length > 0
											? `${passwordId}-error`
											: undefined
									}
								/>
								{field.state.meta.isTouched &&
								field.state.meta.errors.length > 0 ? (
									<p
										id={`${passwordId}-error`}
										role="alert"
										className="text-sm text-destructive"
									>
										{field.state.meta.errors.join(", ")}
									</p>
								) : null}
							</div>
						)}
					</form.Field>

					<Button
						type="submit"
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
				</CardContent>
			</form>
		</Card>
	);
}
