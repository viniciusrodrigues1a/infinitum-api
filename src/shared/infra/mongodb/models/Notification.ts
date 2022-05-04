export type Notification = {
  user_id: string;
  message: string;
  read?: boolean;
  type: "INVITATION" | "KICKED" | "ROLE_UPDATED" | "ISSUE_ASSIGNED";
  metadata: Record<any, any>;
  id?: string;
  createdAt?: number;
};
