import { Argument } from 'discord-akairo';
import { Guild } from 'discord.js';
import { User } from 'discord.js';
import { Message } from 'discord.js';
import { BlacklistModel } from '../../../../model/blacklist';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';

export default class UnblacklistCommand extends FoodBotCommand {
	constructor() {
		super('unblacklist', {
			aliases: ['unblacklist'],
			permissionLevel: PermissionLevel.Manager,
			args: [
				{
					id: 'blacklistInput',
					type: Argument.union('guild', 'user'),
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What guild or user do you want to unblacklist?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid guild/user.`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ blacklistInput }: { blacklistInput: User | Guild }
	) {
		if (!(await BlacklistModel.exists({ _id: blacklistInput.id })))
			return msg.reply(`${blacklistInput} is not blacklisted`);

		await BlacklistModel.deleteOne({
			_id: blacklistInput.id,
		});
		msg.reply(`Sucessfully unblacklisted ${blacklistInput}`);
	}
}
