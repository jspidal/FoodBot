import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { FoodBotCommand } from '../struct/command/foodCommand';

export default class CommandBlocked extends Listener {
	constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
			event: 'commandBlocked',
		});
	}

	async exec(msg: Message, _command: FoodBotCommand, reason: string) {
		if (reason === 'guild blacklisted')
			return msg.channel
				.send(
					'Your guild has been blacklisted, join our discord to resolve this.'
				)
				.catch(e => console.error(e));

		if (reason === 'user blacklisted')
			return msg.author
				.send('You have been blacklisted, join our discord to resolve this.')
				.catch(() =>
					msg.channel.send(
						'You have been blacklisted, join our discord to resolve this.'
					)
				);
	}
}
