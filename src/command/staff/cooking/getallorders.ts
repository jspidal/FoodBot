import { Message } from 'discord.js';
import { OrderModel } from '../../../model/order';
import { FoodBotCommand } from '../../../struct/command/foodCommand';
import { OrderStatus } from '../../../struct/order/orderStatus';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class GetAllOrdersCommand extends FoodBotCommand {
	constructor() {
		super('getallorders', {
			aliases: ['getallorders', 'gao'],
			permissionLevel: PermissionLevel.Cook,
			category: 'cook',
			channel: 'guild',
		});
	}

	async exec(msg: Message) {
		const storedOrders = await OrderModel.find({});
		const waitingOrders = storedOrders.filter(
			order => order.status === OrderStatus.WAITING
		);
		const claimedOrders = storedOrders.filter(
			order => order.status === OrderStatus.CLAIMED
		);
		const allOrders = `**Orders:**\n${waitingOrders
			.map(order => order.id)
			.join(', ')}\n**Claimed / Ready for Delivery:**\n${claimedOrders
			.map(order => order.id)
			.join(', ')}`;
		if (allOrders.length >= 2000)
			return msg.channel.send(
				'Uh oh! It looks like all of the orders have exceeded 2000 characters in length, contact a developer for help!'
			);
		return msg.channel.send(allOrders);
	}
}
