export type FieldErrorItem = { message?: string } | undefined;

export function normalizeFieldErrors(errors: unknown[]): FieldErrorItem[] {
	return errors.map((e) => ({
		message: typeof e === "string" ? e : (e as { message?: string })?.message,
	}));
}

export function getFieldErrorId(formId: string, fieldName: string): string {
	return `${formId}-${fieldName}-error`;
}
