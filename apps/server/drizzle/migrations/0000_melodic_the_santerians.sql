CREATE TYPE "public"."post_type" AS ENUM('general', 'mission');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('inappropriate', 'spam', 'copyright');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"kakao_id" varchar(64) NOT NULL,
	"refresh_token" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_kakao_id_unique" UNIQUE("kakao_id")
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(15) NOT NULL,
	"image_url" varchar(500),
	"is_representative" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"example_image_url" varchar(500),
	"scheduled_at" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "missions_scheduled_at_unique" UNIQUE("scheduled_at")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"type" "post_type" NOT NULL,
	"mission_id" integer,
	"image_urls" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_pet_mission_unique" UNIQUE("pet_id","mission_id")
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "idx_post_like_unique" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"reporter_id" integer NOT NULL,
	"reason" "report_reason" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reports_post_reporter_unique" UNIQUE("post_id","reporter_id")
);
--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pet_user" ON "pets" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_pet_representative_unique" ON "pets" USING btree ("user_id") WHERE "pets"."is_representative" = true;--> statement-breakpoint
CREATE INDEX "idx_post_created" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_post_pet_created" ON "posts" USING btree ("pet_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_post_mission_created" ON "posts" USING btree ("mission_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_post_like_post" ON "post_likes" USING btree ("post_id");