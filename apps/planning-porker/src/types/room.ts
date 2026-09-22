export type RoomData = {
  id: string;
  createdAt: string;
  participants: string[];
  votes: Record<string, number>;
  revealed: boolean;
};
