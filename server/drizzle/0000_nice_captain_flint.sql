CREATE TABLE `ba_gql_demo_reply` (
	`id` text PRIMARY KEY NOT NULL,
	`root_id` text,
	`parent_id` text,
	`author_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`is_link` integer GENERATED ALWAYS AS ("root_id" IS NULL) VIRTUAL NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `ba_gql_demo_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ba_gql_demo_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`about` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_name_idx` ON `ba_gql_demo_user` (lower("name"));--> statement-breakpoint
CREATE TABLE `ba_gql_demo_vote` (
	`user_id` text NOT NULL,
	`reply_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `reply_id`),
	FOREIGN KEY (`user_id`) REFERENCES `ba_gql_demo_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reply_id`) REFERENCES `ba_gql_demo_reply`(`id`) ON UPDATE no action ON DELETE no action
);
