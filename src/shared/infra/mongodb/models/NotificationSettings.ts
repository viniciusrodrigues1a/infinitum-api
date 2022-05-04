import { ObjectId } from "mongodb";

export type NotificationSettings = {
  user_id: string;
  invitation: {
    push: boolean;
    email: boolean;
  };
  kicked: {
    push: boolean;
    email: boolean;
  };
  roleUpdated: {
    push: boolean;
    email: boolean;
  };
  issueAssigned: {
    push: boolean;
    email: boolean;
  };
  id?: ObjectId;
};
