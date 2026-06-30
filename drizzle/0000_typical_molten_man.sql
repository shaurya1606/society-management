CREATE TYPE "public"."role" AS ENUM('EMPLOYEE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."complaint_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."complaint_status" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."email_delivery_status" AS ENUM('SENT', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."email_log_type" AS ENUM('STATUS_CHANGE', 'IMPORTANT_NOTICE');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "resetPasswordToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "resetPasswordToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "twoFactorConfirmation" (
	"id" text NOT NULL,
	"expires" timestamp NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "twoFactorConfirmation_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "twoFactorTokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "twoFactorTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" "role" DEFAULT 'EMPLOYEE' NOT NULL,
	"department" text,
	"manager_id" text,
	"isTwoFactorEnabled" boolean DEFAULT false,
	"twoFactorConfirmationId" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"changes" jsonb,
	"changed_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escalation_event" (
	"id" text PRIMARY KEY NOT NULL,
	"rule_id" text NOT NULL,
	"user_id" text NOT NULL,
	"cycle_id" text,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"resolved_at" timestamp,
	"resolved_by_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escalation_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"trigger" text NOT NULL,
	"days_after_trigger" integer NOT NULL,
	"notify_employee" boolean DEFAULT true NOT NULL,
	"notify_manager" boolean DEFAULT true NOT NULL,
	"notify_hr" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goal_sheet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"submitted_at" timestamp,
	"approved_by_id" text,
	"approved_at" timestamp,
	"returned_at" timestamp,
	"return_reason" text,
	"unlocked_at" timestamp,
	"unlocked_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_sheet_id" text NOT NULL,
	"thrust_area_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"uom_type" text NOT NULL,
	"target_value" numeric(14, 4),
	"target_deadline" timestamp,
	"weightage" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"shared_goal_id" text,
	"is_shared_recipient" boolean DEFAULT false NOT NULL,
	"is_primary_owner" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "manager_check_in" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"manager_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"period" text NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "performance_cycle" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"phase" text NOT NULL,
	"opens_at" timestamp NOT NULL,
	"closes_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "quarterly_update" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"period" text NOT NULL,
	"actual_value" numeric(14, 4),
	"actual_completion_date" timestamp,
	"achievement_status" text DEFAULT 'NOT_STARTED' NOT NULL,
	"progress_score" numeric(7, 4),
	"notes" text,
	"updated_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "shared_goal" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"thrust_area_id" text NOT NULL,
	"uom_type" text NOT NULL,
	"target_value" numeric(14, 4),
	"target_deadline" timestamp,
	"primary_owner_user_id" text NOT NULL,
	"created_by_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "thrust_area" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "thrust_area_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"overdue_threshold_days" integer DEFAULT 7 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "complaint_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"complaint_id" text NOT NULL,
	"from_status" "complaint_status" NOT NULL,
	"to_status" "complaint_status" NOT NULL,
	"actor_id" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaint" (
	"id" text PRIMARY KEY NOT NULL,
	"resident_id" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"photo_url" text,
	"status" "complaint_status" DEFAULT 'OPEN' NOT NULL,
	"priority" "complaint_priority" DEFAULT 'MEDIUM' NOT NULL,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "email_log" (
	"id" text PRIMARY KEY NOT NULL,
	"recipient_email" text NOT NULL,
	"type" "email_log_type" NOT NULL,
	"related_complaint_id" text,
	"related_notice_id" text,
	"status" "email_delivery_status" DEFAULT 'SENT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notice" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"is_important" boolean DEFAULT false NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twoFactorConfirmation" ADD CONSTRAINT "twoFactorConfirmation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_manager_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_rule_id_escalation_rule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."escalation_rule"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_resolved_by_id_user_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_approved_by_id_user_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_unlocked_by_id_user_id_fk" FOREIGN KEY ("unlocked_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_goal_sheet_id_goal_sheet_id_fk" FOREIGN KEY ("goal_sheet_id") REFERENCES "public"."goal_sheet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_thrust_area_id_thrust_area_id_fk" FOREIGN KEY ("thrust_area_id") REFERENCES "public"."thrust_area"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_shared_goal_id_shared_goal_id_fk" FOREIGN KEY ("shared_goal_id") REFERENCES "public"."shared_goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_check_in" ADD CONSTRAINT "manager_check_in_employee_id_user_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_check_in" ADD CONSTRAINT "manager_check_in_manager_id_user_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_check_in" ADD CONSTRAINT "manager_check_in_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarterly_update" ADD CONSTRAINT "quarterly_update_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarterly_update" ADD CONSTRAINT "quarterly_update_updated_by_id_user_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_thrust_area_id_thrust_area_id_fk" FOREIGN KEY ("thrust_area_id") REFERENCES "public"."thrust_area"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_primary_owner_user_id_user_id_fk" FOREIGN KEY ("primary_owner_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_status_history" ADD CONSTRAINT "complaint_status_history_complaint_id_complaint_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_status_history" ADD CONSTRAINT "complaint_status_history_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_resident_id_user_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_related_complaint_id_complaint_id_fk" FOREIGN KEY ("related_complaint_id") REFERENCES "public"."complaint"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_related_notice_id_notice_id_fk" FOREIGN KEY ("related_notice_id") REFERENCES "public"."notice"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notice" ADD CONSTRAINT "notice_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "goal_sheet_user_cycle_idx" ON "goal_sheet" USING btree ("user_id","cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "manager_check_in_employee_cycle_period_idx" ON "manager_check_in" USING btree ("employee_id","cycle_id","period");--> statement-breakpoint
CREATE UNIQUE INDEX "performance_cycle_year_phase_idx" ON "performance_cycle" USING btree ("year","phase");--> statement-breakpoint
CREATE UNIQUE INDEX "quarterly_update_goal_period_idx" ON "quarterly_update" USING btree ("goal_id","period");--> statement-breakpoint
CREATE INDEX "complaint_status_history_complaint_id_idx" ON "complaint_status_history" USING btree ("complaint_id");--> statement-breakpoint
CREATE INDEX "complaint_resident_id_idx" ON "complaint" USING btree ("resident_id");--> statement-breakpoint
CREATE INDEX "complaint_status_idx" ON "complaint" USING btree ("status");--> statement-breakpoint
CREATE INDEX "complaint_priority_idx" ON "complaint" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "complaint_category_idx" ON "complaint" USING btree ("category");--> statement-breakpoint
CREATE INDEX "complaint_created_at_idx" ON "complaint" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "email_log_recipient_email_idx" ON "email_log" USING btree ("recipient_email");--> statement-breakpoint
CREATE INDEX "notice_is_important_idx" ON "notice" USING btree ("is_important");