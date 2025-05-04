CREATE TABLE IF NOT EXISTS "form" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	"accepting_responses" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_field" (
	"id" text PRIMARY KEY NOT NULL,
	"form_id" text NOT NULL,
	"index" integer,
	"name" text,
	"subtitle" text,
	"required" boolean DEFAULT false,
	"type" text NOT NULL,
	"options" text[],
	"shuffle_options" boolean DEFAULT false,
	"other_option" boolean DEFAULT false,
	"options_style" text DEFAULT 'radio',
	"text_size" text DEFAULT 'normal'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"form_id" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_submission_field_value" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"field_id" text NOT NULL,
	"value" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'basic',
	"picture" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form" ADD CONSTRAINT "form_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_field" ADD CONSTRAINT "form_field_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_submission_field_value" ADD CONSTRAINT "form_submission_field_value_submission_id_form_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submission"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_submission_field_value" ADD CONSTRAINT "form_submission_field_value_field_id_form_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_field"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth" ADD CONSTRAINT "oauth_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
