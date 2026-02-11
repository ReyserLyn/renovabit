import { schemas } from "@renovabit/db/schema";
import z from "zod";

export const UserSchema = schemas.user.select;
export const UserInsertBodySchema = schemas.user.insert;
export const UserUpdateBodySchema = schemas.user.update;

export type User = z.infer<typeof UserSchema>;
export type UserInsertBody = z.infer<typeof UserInsertBodySchema>;
export type UserUpdateBody = z.infer<typeof UserUpdateBodySchema>;

export const AdminCreateUserBodySchema = schemas.user.adminCreate;
export const AdminChangePasswordBodySchema = schemas.user.adminChangePassword;

export type AdminCreateUserBody = z.infer<typeof AdminCreateUserBodySchema>;
export type AdminChangePasswordBody = z.infer<
	typeof AdminChangePasswordBodySchema
>;

export const UserSessionSchema = schemas.user.session;
export type UserSession = z.infer<typeof UserSessionSchema>;

export const UserBanSchema = schemas.user.ban;
export type UserBan = z.infer<typeof UserBanSchema>;
