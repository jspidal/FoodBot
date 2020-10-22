import { DocumentType } from '@typegoose/typegoose';
import dayjs from 'dayjs';
import { Message } from 'discord.js';
import { Order } from '../../../model/order';
import { StaffModel } from '../../../model/staff';
import { FoodBotCommand } from '../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class DeliverOrderCommand extends FoodBotCommand {
	constructor() {
		super('deliver', {
			aliases: ['deliver', 'd'],
			permissionLevel: PermissionLevel.Cook,
			category: 'cook',
			channel: 'guild',
			args: [
				{
					id: 'order',
					type: 'claimedOrder',
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
		msg.channel.send(
			`${msg.author} DMing you an invite! Go deliver it! Remember to be nice and ask for \`;feedback\`!`
		);
		const guild = this.client.guilds.cache.get(order.guild);

		if (!guild?.available)
			return msg.channel.send(
				`Oops! It looks like the guild is unavailable! Try again later`
			);

		const channel = guild.channels.cache.get(order.channel);
		if (!channel) return;

		const invite = await channel?.createInvite();
		msg.author.send(
			`Invite: ${invite.url}\nName: ${this.client.users.cache.get(order.user)}`
		);

		const storedStaff = await StaffModel.findOne({
			staffID: msg.author.id,
		}).exec();

		const amountClaimed = storedStaff?.ordersClaimed || 0;
		await StaffModel.updateOne(
			{ staffID: msg.author.id },
			{ ordersCompleted: amountClaimed + 1, recentOrder: dayjs().toDate() }
		);
		await order.deleteOne();
	}
}
