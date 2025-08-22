export type ChangePasswordPort = {
	changePassword(
		username: string,
		oldPassword: string,
		newPassword: string,
	): Promise<void>;
};
