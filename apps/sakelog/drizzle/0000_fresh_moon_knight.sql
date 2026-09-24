CREATE TABLE `drink_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`drink_id` integer NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`drink_id`) REFERENCES `drinks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drink_ingredients_drink_name_idx` ON `drink_ingredients` (`drink_id`,`name`);--> statement-breakpoint
CREATE INDEX `drink_ingredients_name_idx` ON `drink_ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `drink_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`drink_id` integer NOT NULL,
	`key` text NOT NULL,
	`content_type` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`drink_id`) REFERENCES `drinks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `drink_photos_drink_idx` ON `drink_photos` (`drink_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `drinks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`maker` text,
	`category` text DEFAULT 'wine' NOT NULL,
	`style` text,
	`year` integer,
	`abv` real,
	`country` text,
	`region` text,
	`polishing_rate` integer,
	`sake_meter_value` real,
	`acidity` real,
	`aged_years` integer,
	`cask_type` text,
	`ibu` integer,
	`distillation` text,
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
CREATE INDEX `drinks_drunk_at_idx` ON `drinks` (`drunk_at`);--> statement-breakpoint
CREATE INDEX `drinks_category_rating_idx` ON `drinks` (`category`,`rating_overall`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);