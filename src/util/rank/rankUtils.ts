import dayjs from 'dayjs';
import { DocumentQuery } from 'mongoose';
import { FoodClient } from '../../client/foodClient';
import { StaffModel as Staff } from '../../model/staff';
import { getPermissionLevel } from '../permission/getPermissionLevel';
import { PermissionLevel } from '../permission/permissionLevel';

/*
    Moves the provided user's rank up by 1
*/
export async function promote(
	userID: string,
	client: FoodClient
): Promise<string> {
	//let rank = await checkRank(userID)

	let permLevel = await getPermissionLevel(userID, client);

	if (
		permLevel === PermissionLevel.BotDeveloper &&
		!Staff.exists({ staffID: userID })
	) {
		await setupUser(userID, 'Bot Developer');
	}

	if (permLevel === PermissionLevel.Everyone) {
		await setupUser(userID);
		return 'Trainee';
	} else if (permLevel < PermissionLevel.Admin) {
		let newRank: string = PermissionLevel[permLevel + 1];
		await Staff.updateOne({ staffID: userID }, { staffRank: newRank });
		return newRank;
	}

	return 'Admin';
}

/*
    Moves the provided user's rank down by 1
*/
export async function demote(
	userID: string,
	client: FoodClient
): Promise<string> {
	let rank = await checkRank(userID);

	let permLevel = await getPermissionLevel(userID, client);
	if (permLevel === PermissionLevel.Everyone) {
		await setupUser(userID);
	} else if (permLevel > PermissionLevel.Everyone) {
		let newRank: string = PermissionLevel[permLevel - 1];
		await Staff.updateOne({ staffID: userID }, { staffRank: newRank });
		return newRank;
	}

	return 'Customer';
}

/*
    Returns a user's current rank, or Customer if their rank is not set
*/
export async function checkRank(userID: string): Promise<String | undefined> {
	if (!Staff.exists({ staffID: userID })) return 'Customer';
	let result = await Staff.findOne({ staffID: userID }).exec();
	if (!result) return;
	return result.staffRank;
}

/*
    Set a user's rank to the string provided
*/
export async function setRank(userID: string, rank: string) {
	if (!Staff.exists({ staffID: userID }))
		await setupUser(userID, rank).catch(e => console.error(e));
	else {
		await Staff.updateOne({ staffID: userID }, { staffRank: rank });
	}
}

export function isStaff(userID: string): boolean {
	if (Staff.exists({ staffID: userID, $nor: [{ staffRank: 'Customer' }] }))
		return true;
	return false;
}

/*
    Create a new cook with rank Trainee if no rank is provided.
*/
async function setupUser(userID: string, rank: string = 'Trainee') {
	let newStaff = new Staff({
		staffID: userID,
		staffRank: rank,
		dateHired: dayjs().format('MM/DD/YYYY'),
		ordersClaimed: 0,
		ordersCompleted: 0,
	});
	await newStaff.save().catch(e => console.error(e));
}
