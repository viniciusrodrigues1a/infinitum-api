export type NotificationSettingsDTO = {
  invitation: { email: boolean; push: boolean };
  kicked: { email: boolean; push: boolean };
  roleUpdated: { email: boolean; push: boolean };
};
