ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tenant" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_tenants_id_fk" FOREIGN KEY ("tenant") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
