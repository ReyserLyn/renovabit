type UserRole = "admin" | "distributor" | "customer";

export function validatePasswordStrength(
	password: string,
	role: UserRole = "customer",
): {
	valid: boolean;
	error?: string;
} {
	// Longitud mínima
	if (password.length < 8) {
		return {
			valid: false,
			error: "La contraseña debe tener al menos 8 caracteres",
		};
	}

	// Longitud máxima
	if (password.length > 100) {
		return {
			valid: false,
			error: "La contraseña es demasiado larga",
		};
	}

	// Para admin y distributor, validar complejidad adicional
	if (role === "admin" || role === "distributor") {
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /[0-9]/.test(password);

		if (!hasUpperCase || !hasLowerCase || !hasNumber) {
			return {
				valid: false,
				error:
					"La contraseña debe contener al menos una mayúscula, una minúscula y un número",
			};
		}
	}

	// Para customer, solo validar longitud mínima (8 caracteres)
	return { valid: true };
}
