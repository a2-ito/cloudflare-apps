CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `wine_grapes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wine_id` integer NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`wine_id`) REFERENCES `wines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wine_grapes_wine_name_idx` ON `wine_grapes` (`wine_id`,`name`);--> statement-breakpoint
CREATE INDEX `wine_grapes_name_idx` ON `wine_grapes` (`name`);--> statement-breakpoint
CREATE TABLE `wine_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wine_id` integer NOT NULL,
	`key` text NOT NULL,
	`content_type` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`wine_id`) REFERENCES `wines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `wine_photos_wine_idx` ON `wine_photos` (`wine_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `wines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`producer` text,
	`vintage` integer,
	`type` text DEFAULT 'red' NOT NULL,
	`country` text,
	`region` text,
	`price_minor` integer,
	`price_currency` text,
	`shop` text,
	`shop_url` text,
	`drunk_at` text,
	`rating_overall` integer,
	`rating_aroma` integer,
	`rating_taste` integer,
	`rating_finish` integer,
	`rating_value` integer,
	`note` text,
	`author_id` integer NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wines_drunk_at_idx` ON `wines` (`drunk_at`);--> statement-breakpoint
CREATE INDEX `wines_type_rating_idx` ON `wines` (`type`,`rating_overall`);