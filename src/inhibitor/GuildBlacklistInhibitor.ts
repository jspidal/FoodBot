import { Message } from 'discord.js';
import { Inhibitor } from 'discord-akairo';
import { BlacklistModel } from '../model/blacklist';

export default class GuildBlacklistInhibitor extends Inhibitor {
	constructor() {
		super('guildblacklist', {
			reason: 'guild blacklisted',
			priority: 1,
		});
	}

	async exec(msg: Message) {
		const calledCmd = await this.client.commandHandler.parseCommand(msg);
		if (calledCmd.command?.categoryID != 'ordering') return false;

		const blacklist = await BlacklistModel.exists({
			_id: msg.guild?.id,
		});
		return blacklist;
	}
}
