import { z } from "zod";

export const idParam = z.object({
	id: z.uuidv7({ message: "ID inválido" }),
});
