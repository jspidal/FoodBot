import { User } from 'discord.js';
import { Message } from 'discord.js';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';
import { getRank, setRank } from '../../../../util/rank/rankUtils';

export default class StaffPromoteCommand extends FoodBotCommand {
	constructor() {
		super('staff-set', {
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

				{
					id: 'role',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what should the user's role be set to?`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { user, role }: { user: User; role: string }) {
		const previousRank = await getRank(user.id);
		if (!previousRank) return;
		const newInfo = await setRank(user.id, msg.author.id, role).catch(e => console.error(e));
		if (newInfo){
			this.client.emit('staffUpdate', newInfo, user, previousRank)			
			return msg.reply(`${user} has been set to \`${role}\``);
		}
		
			
	}
}
