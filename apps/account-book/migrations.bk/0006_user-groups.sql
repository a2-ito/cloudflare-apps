-- Migration number: 0006 	 2026-01-11T13:14:34.315Z
CREATE TABLE user_groups (
  user_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (group_id) REFERENCES groups(id)
);
