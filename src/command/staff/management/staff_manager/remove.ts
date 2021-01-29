import { User } from 'discord.js';
import { Message } from 'discord.js';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';
import { deleteUser } from '../../../../util/rank/rankUtils';

export default class StaffPromoteCommand extends FoodBotCommand {
	constructor() {
		super('staff-remove', {
			permissionLevel: PermissionLevel.Manager,
			category: 'staff',
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'user',
					prompt: {
						start: (msg: Message) => `${msg.author}, who should be removed?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid user.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { user }: { user: User }) {
		const deletedEntry = await deleteUser(user.id).catch(e => console.error(e));
		if (deletedEntry) {
			msg.channel.send(`${user.username} has been removed`);
			this.client.emit('staffRemove', deletedEntry, user);
		}
	}
}
