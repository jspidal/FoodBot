import { Message } from 'discord.js';
import { Inhibitor } from 'discord-akairo';
import { BlacklistModel } from '../model/blacklist';

export default class UserBlacklistInhibitor extends Inhibitor {
	constructor() {
		super('userblacklist', {
			reason: 'user blacklisted',
		});
	}

	async exec(msg: Message) {
		const calledCmd = await this.client.commandHandler.parseCommand(msg);
		if (calledCmd.command?.categoryID != 'ordering') return false;

		const blacklist = await BlacklistModel.exists({
			_id: msg.author.id
		});
		return blacklist;
	}
}
