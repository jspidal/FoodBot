import { User } from 'discord.js';
import { Message } from 'discord.js';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';
import { isStaff, setRank } from '../../../../util/rank/rankUtils';

export default class StaffPromoteCommand extends FoodBotCommand {
	constructor() {
		super('staff-add', {
			permissionLevel: PermissionLevel.Manager,
			category: 'staff',
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'user',
					prompt: {
						start: (msg: Message) => `${msg.author}, who should be added?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid user.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { user }: { user: User }) {
		if (await isStaff(user.id)) return msg.reply(`${user} is already staff`);
		const res = await setRank(user.id, msg.author.id, 'Trainee').catch(e =>
			console.error(e)
		);

		if (res) this.client.emit('staffAdd', res, user);
		return msg.reply(`${user} has been set to \`Trainee\``);
	}
}
