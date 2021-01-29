import dayjs from 'dayjs';
import { FoodClient } from '../../client/foodClient';
import { StaffModel as Staff, StaffModel } from '../../model/staff';
import { getPermissionLevel } from '../permission/getPermissionLevel';
import { PermissionLevel } from '../permission/permissionLevel';

/*
    Moves the provided user's rank up by 1
*/
export async function promoteUser(
	userID: string,
	promotedBy: string,
	client: FoodClient
): Promise<string> {
	const permLevel = await getPermissionLevel(userID, client);

	if (
		permLevel === PermissionLevel.BotDeveloper &&
		!Staff.exists({ staffID: userID })
	) {
		await setupUser(userID, 'Bot Developer');
	}

	if (permLevel === PermissionLevel.Everyone) {
		await setupUser(userID, promotedBy);
		return 'Trainee';
	} else if (permLevel < PermissionLevel.Admin) {
		const newRank: string = PermissionLevel[permLevel + 1];
		await Staff.updateOne({ staffID: userID }, { staffRank: newRank });
		return newRank;
	}

	return 'Admin';
}

/*
    Moves the provided user's rank down by 1
*/
export async function demoteUser(
	userID: string,
	demotedBy: string,
	client: FoodClient
) {
	const permLevel = await getPermissionLevel(userID, client);
	if (permLevel > PermissionLevel.Everyone) {
		const newRank = PermissionLevel[permLevel - 1];
		await setRank(userID, demotedBy, newRank);
		return newRank;
	}

	return 'Customer';
}

/*
    Returns a user's current rank, or Customer if their rank is not set
*/
export async function getRank(userID: string) {
	if (!(await isStaff(userID))) return 'Customer';
	const result = await Staff.findOne({ staffID: userID }).exec();
	if (!result) return;
	return result.staffRank;
}

/*
    Set a user's rank to the string provided
*/
export async function setRank(userID: string, hiredBy: string, rank: string) {
	if (!(await isStaff(userID))) {
		if (await Staff.findOne({ staffID: userID, rank: 'Customer' }).exec()) {
			const foundStaff = await Staff.findOne({ staffID: userID }).exec();
			await foundStaff?.updateOne({ staffRank: rank, hiredBy: hiredBy });
			return foundStaff;
		}
		return await setupUser(userID, hiredBy, rank).catch(e => console.error(e));
	} else {
		const foundStaff = await Staff.findOne({ staffID: userID }).exec();
		await foundStaff?.updateOne({ staffRank: rank, hiredBy: hiredBy });
		return foundStaff;
	}
}

export async function isStaff(userID: string) {
	return await Staff.exists({
		staffID: userID,
		$nor: [{ staffRank: 'Customer' }],
	});
}

/*
    Create a new cook with rank Trainee if no rank is provided.
*/
async function setupUser(
	userID: string,
	hiredBy: string,
	rank: string = 'Trainee'
) {
	const newStaff = await Staff.create({
		staffID: userID,
		staffRank: rank,
		dateHired: dayjs().format('MM/DD/YYYY'),
		hiredBy: hiredBy,
		ordersClaimed: 0,
		ordersCompleted: 0,
	}).catch(e => console.error(e));

	return newStaff;
}

export async function deleteUser(userID: string) {
	const foundStaff = await Staff.findOneAndDelete({ staffID: userID });
	if (foundStaff) return foundStaff;
}
