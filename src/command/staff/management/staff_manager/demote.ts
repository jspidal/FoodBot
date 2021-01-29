import { User } from 'discord.js';
import { Message } from 'discord.js';
import { FoodClient } from '../../../../client/foodClient';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';
import { demoteUser, isStaff } from '../../../../util/rank/rankUtils';

export default class StaffDemoteCommand extends FoodBotCommand {
	constructor() {
		super('staff-demote', {
			permissionLevel: PermissionLevel.Manager,
			category: 'staff',
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'user',
					prompt: {
						start: (msg: Message) => `${msg.author}, who should be demoted?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid user.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { user }: { user: User }) {
		if (!(await isStaff(user.id))) return msg.reply(`${user} is not staff`);
		const nextRank: string = await demoteUser(
			user.id,
			msg.author.id,
			this.client
		);
		return msg.reply(`${user} has been demoted to ${nextRank}`);
	}
}
