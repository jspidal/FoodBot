import { Message } from 'discord.js';
import { FoodBotCommand } from '../../struct/command/foodCommand';

export default class PingCommand extends FoodBotCommand {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			category: 'utility',
			description: {
				content: 'Ping, pong',
			},
		});
	}

	async exec(msg: Message) {
		const m = await msg.channel.send(':ping_pong: Ping?');
		m.edit(
			`:ping_pong: Pong! (Roundtrip: ${
				m.createdTimestamp - msg.createdTimestamp
			}ms | One-way: ${~~this.client.ws.ping}ms)`
		);
	}
}
