export type Notification = {
  user_id: string;
  read?: boolean;
  type:
    | "INVITATION"
    | "KICKED"
    | "KICKED_ADMIN"
    | "ROLE_UPDATED"
    | "ROLE_UPDATED_ADMIN"
    | "ISSUE_ASSIGNED"
    | "PROJECT_DELETED";
  metadata: Record<any, any>;
  id?: string;
  createdAt?: number;
};
