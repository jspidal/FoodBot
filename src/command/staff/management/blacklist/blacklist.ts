import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Argument } from 'discord-akairo';
import { Guild } from 'discord.js';
import { User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { BlacklistModel } from '../../../../model/blacklist';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { getPermissionLevel } from '../../../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';

dayjs.extend(localizedFormat);

export default class BlacklistCommand extends FoodBotCommand {
	constructor() {
		super('blacklist', {
			aliases: ['blacklist'],
			permissionLevel: PermissionLevel.Manager,
			args: [
				{
					id: 'blacklistInput',
					type: Argument.union('guild', 'user'),
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What guild or user do you want to blacklist?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid guild/user.`,
					},
                },
                {
                    id: 'info',
                    match: 'flag',
                    flag: ['-i', '--info']
                },
				{
					id: 'reason',
					type: 'string',
					match: 'option',
					flag: ['-r', '--reason'],
				},
			],
		});
	}

	async exec(msg: Message, { blacklistInput, info, reason }: { blacklistInput: User | Guild, info: string, reason: string }) {
        if (info) {
            const blacklistInfo = await BlacklistModel.findOne({_id: blacklistInput.id})
            if (!blacklistInfo) return msg.reply('That user is not blacklisted');
            const type = blacklistInput instanceof User ? 'User' : 'Guild';
            const infoEmbed = new MessageEmbed()
                .setTitle('Blacklist Information')
                .addField(type, blacklistInput, true)
                .addField('Reason', (blacklistInfo?.reason || 'No reason set'), true)
                .addField('Admin', this.client.users.cache.get(blacklistInfo!.admin)?.tag, true)
                .addField('Date Created', dayjs(blacklistInfo?.date).format('llll'))
                .setColor('RED')
                .setTimestamp();
            return msg.reply(`Here's your requested info`, {embed: infoEmbed});
        }
		//Don't allow admins and bot developers to be blacklisted.
		if (
			blacklistInput instanceof User &&
			(await getPermissionLevel(blacklistInput.id, this.client)) >
				this.permissionLevel
		)
			return msg.reply('You cannot blacklist this user.');

		if (await BlacklistModel.exists({ _id: blacklistInput.id }))
			return msg.reply(`${blacklistInput} is already blacklisted`);

		await BlacklistModel.create({
			_id: blacklistInput.id,
			admin: msg.author.id,
			date: Date.now(),
			reason: reason || undefined,
		});

		msg.reply(
			`Sucessfully blacklisted ${blacklistInput} ${
				reason ? `for ${reason}` : ''
			}`
        );
        
	}
}
