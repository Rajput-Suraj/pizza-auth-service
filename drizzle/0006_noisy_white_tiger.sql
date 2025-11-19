CREATE TABLE "users_to_tenants" (
	"user_id" integer NOT NULL,
	"tenant_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_to_tenants_user_id_tenant_id_pk" PRIMARY KEY("user_id","tenant_id")
);
--> statement-breakpoint
ALTER TABLE "users_to_tenants" ADD CONSTRAINT "users_to_tenants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_tenants" ADD CONSTRAINT "users_to_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;