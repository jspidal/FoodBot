import { FoodClient } from '../../client/foodClient';
import { PermissionLevel } from './permissionLevel';
import { checkRank } from '../rank/rankUtils';

export async function getPermissionLevel(
	userID: string,
	client: FoodClient
): Promise<number> {
	if (client.ownerID === userID) return PermissionLevel.BotDeveloper;

	let rank: String | undefined = await checkRank(userID);

	if (!rank) return PermissionLevel.Everyone;

	switch (rank) {
		case 'Customer':
			return PermissionLevel.Everyone;
		case 'Cook':
			return PermissionLevel.Cook;
		case 'VeteranCook':
			return PermissionLevel.VeteranCook;
		case 'Manager':
			return PermissionLevel.Manager;
		case 'Admin':
			return PermissionLevel.Admin;
	}

	return PermissionLevel.Everyone;
}
