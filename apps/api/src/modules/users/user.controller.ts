import { Elysia } from "elysia";
import { authMacro } from "@/modules/auth/middleware";

export const userController = new Elysia({ prefix: "/users" }).use(authMacro);
