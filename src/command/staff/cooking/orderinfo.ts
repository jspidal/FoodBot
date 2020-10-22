import { DocumentType } from '@typegoose/typegoose';
import { Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Order } from '../../../model/order';
import { Staff, StaffModel } from '../../../model/staff';
import { FoodBotCommand } from '../../../struct/command/foodCommand';
import { OrderStatus } from '../../../struct/order/orderStatus';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class OrderInfoCommand extends FoodBotCommand {
	constructor() {
		super('orderinfo', {
			aliases: ['orderinfo', 'oi'],
			permissionLevel: PermissionLevel.Cook,
			category: 'cook',
			channel: 'guild',
			args: [
				{
					id: 'order',
					type: Argument.union('claimedOrder', 'claimedOrder'),
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
		const guild = await this.client.guilds.fetch(order.guild);
		const embed = new MessageEmbed()
			.setTitle('Order Information')
			.addField('Order', order.content, true)
			.addField('Order ID', order.id, true)
			.addField('Order Server', guild?.name, true)
			.addField(
				'Customer',
				guild.member(order.user)?.user.tag + `(${order.user})`,
				true
			)
			.addField('Order Status', order.status, true)
			.setColor('0x00fc36')
			.setThumbnail(guild?.iconURL({ dynamic: true }) || '')
			.setTimestamp();
		return msg.reply('Here in the info', { embed: embed });
	}
}
