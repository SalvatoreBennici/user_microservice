export type ChangeUsernamePort = {
	changeUsername(currentUsername: string, newUsername: string): Promise<void>;
};
