ALTER TABLE "sessions" DROP CONSTRAINT "sessions_impersonated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "impersonated_by";