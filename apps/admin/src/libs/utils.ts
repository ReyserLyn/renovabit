export function formatDate(value: string | Date | null | undefined): string {
	try {
		if (value == null) return "—";

		const d = typeof value === "string" ? new Date(value) : value;

		if (Number.isNaN(d.getTime())) return "—";

		return d.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	} catch {
		return "—";
	}
}
