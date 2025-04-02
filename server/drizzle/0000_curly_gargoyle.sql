CREATE TABLE "ba_gql_demo_reply" (
	"id" text PRIMARY KEY NOT NULL,
	"root_id" text,
	"parent_id" text,
	"author_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"content" text,
	"is_link" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ba_gql_demo_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"about" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ba_gql_demo_vote" (
	"user_id" text NOT NULL,
	"reply_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "ba_gql_demo_vote_user_id_reply_id_pk" PRIMARY KEY("user_id","reply_id")
);
--> statement-breakpoint
ALTER TABLE "ba_gql_demo_reply" ADD CONSTRAINT "ba_gql_demo_reply_author_id_ba_gql_demo_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."ba_gql_demo_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ba_gql_demo_vote" ADD CONSTRAINT "ba_gql_demo_vote_user_id_ba_gql_demo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ba_gql_demo_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ba_gql_demo_vote" ADD CONSTRAINT "ba_gql_demo_vote_reply_id_ba_gql_demo_reply_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."ba_gql_demo_reply"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_name_idx" ON "ba_gql_demo_user" USING btree (lower("name"));