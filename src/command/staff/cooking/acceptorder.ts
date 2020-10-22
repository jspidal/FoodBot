import { DocumentType } from '@typegoose/typegoose';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Order } from '../../../model/order';
import { StaffModel } from '../../../model/staff';
import { FoodBotCommand } from '../../../struct/command/foodCommand';
import { OrderStatus } from '../../../struct/order/orderStatus';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class AcceptOrderCommand extends FoodBotCommand {
	constructor() {
		super('acceptorder', {
			aliases: ['acceptorder', 'ao'],
			permissionLevel: PermissionLevel.Cook,
			category: 'cook',
			channel: 'guild',
			args: [
				{
					id: 'order',
					type: 'unclaimedOrder',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What is the id of the order?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid id.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { order }: { order: DocumentType<Order> }) {
		const embed = new MessageEmbed()
			.setTitle(`Your order is being delivered by ${msg.author.tag}!`)
			.setDescription(`\`\`\`${order.content}\`\`\``)
			.setColor('0xfcc100')
			.setTimestamp();
		const user = await this.client.users.fetch(order.user);
		user?.send(`Your order is being delivered soon! Watch out!`, {
			embed: embed,
		});
		await order.updateOne({ status: OrderStatus.CLAIMED }).exec();
		const storedStaff = await StaffModel.findOne({
			staffID: msg.author.id,
		}).exec();
		const amountClaimed = storedStaff?.ordersClaimed || 0;
		await StaffModel.updateOne(
			{ staffID: msg.author.id },
			{ ordersClaimed: amountClaimed + 1 }
		);
		return msg.channel.send(`👍`);
	}
}
