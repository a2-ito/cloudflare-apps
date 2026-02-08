CREATE TABLE `participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` text NOT NULL,
	`name` text NOT NULL,
	`joined_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participants_room_name_unique` ON `participants` (`room_id`,`name`);--> statement-breakpoint
CREATE INDEX `participants_room_id_idx` ON `participants` (`room_id`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`revealed` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` text NOT NULL,
	`participant_name` text NOT NULL,
	`value` integer,
	`voted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votes_room_participant_unique` ON `votes` (`room_id`,`participant_name`);--> statement-breakpoint
CREATE INDEX `votes_room_id_idx` ON `votes` (`room_id`);