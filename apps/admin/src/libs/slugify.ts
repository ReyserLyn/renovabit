import slugifyLib from "slugify";

export function slugify(name: string): string {
	return slugifyLib(name, {
		lower: true,
		strict: true,
		trim: true,
		locale: "es",
	});
}
