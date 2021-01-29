import { DocumentType } from '@typegoose/typegoose';
import { Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Order } from '../../../model/order';
import { StaffModel } from '../../../model/staff';
import { FoodBotCommand } from '../../../struct/command/foodCommand';
import { OrderStatus } from '../../../struct/order/orderStatus';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class DeleteOrderCommand extends FoodBotCommand {
	constructor() {
		super('deleteorder', {
			aliases: ['deleteorder', 'do'],
			permissionLevel: PermissionLevel.Cook,
			category: 'cook',
			channel: 'guild',
			args: [
				{
					id: 'order',
					type: Argument.union('claimedOrder', 'unclaimedOrder'),
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What is the id of the order?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid id.`,
					},
				},
				{
					id: 'reason',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What is the reason for deletion?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a reason for deletion.`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ order, reason }: { order: DocumentType<Order>; reason: string }
	) {
		this.client.users.cache
			.get(order.user)
			?.send(
				`Your order has been deleted for \`${reason}\`, if you believe this is a mistake or have feedback, use the feedback command or join our discord.`
			)
			.catch(e => {
				msg.channel.send(`User was unable to be notified of order deletion.`);
				console.error(e);
			});
		this.client.emit('orderDelete', order, msg.author, reason)
		order.deleteOne();
		msg.channel.send(`${msg.author} has deleted order \`${order.id}\``);
	}
}
