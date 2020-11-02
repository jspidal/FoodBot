import { Argument } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Message } from 'discord.js';
import { OrderModel } from '../../model/order';
import { FoodBotCommand } from '../../struct/command/foodCommand';
import { OrderTicket } from '../../struct/order/orderTicket';

export default class OrderCommand extends FoodBotCommand {
	constructor() {
		super('order', {
			aliases: ['order'],
			category: 'ordering',
			channel: 'guild',
			clientPermissions: ['CREATE_INSTANT_INVITE'],
			args: [
				{
					id: 'order',
					type: Argument.validate(
						'string',
						(_msg, _phrase, val) => val.length < 50
					),
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what would you like to order?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid order. (Length must be less than 50)`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { order }: { order: string }) {
		if (!msg.guild) return;
		if (OrderModel.exists({user: msg.author.id})) return msg.reply("You already have an active order")
		let ticket = new OrderTicket({
			content: order,
			guild: msg.guild,
			channel: msg.channel as TextChannel,
			user: msg.author,
			client: this.client,
		});
		let t = await ticket.submit();
		if (!t) return;
		return msg.channel.send(
			`Order for ${order} has been received (ID: ${t.id})`
		);
	}
}
