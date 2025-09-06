export type ResetAdminPasswordPort = {
  resetPassword(username: string, newPassword: string): Promise<void>;
};
