import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { MESSAGES } from '../util/constants';

export default class MissingClientPermission extends Listener {
	constructor() {
		super('missingClientPermission', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
		});
	}

	async exec(msg: Message, command: Command, type: string, missing: any) {
		if (type === 'client') {
			msg.channel.send(
				MESSAGES.events.commandHandler.missingPermissons.client(missing)
			);
		}
	}
}
