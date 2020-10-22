import { User } from 'discord.js';
import { Message } from 'discord.js';
import { FoodClient } from '../../../../client/foodClient';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';
import { demote } from '../../../../util/rank/rankUtils';

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
		let nextRank: string = await demote(user.id, this.client);
		return msg.reply(`${user} has been promoted to ${nextRank}`);
	}
}
