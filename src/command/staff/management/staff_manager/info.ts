import dayjs from 'dayjs';

import { MessageEmbed } from 'discord.js';
import { User } from 'discord.js';
import { Message } from 'discord.js';

import { StaffModel as Staff } from '../../../../model/staff';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';
import { PermissionLevel } from '../../../../util/permission/permissionLevel';

export default class StaffInfoCommand extends FoodBotCommand {
	constructor() {
		super('staff-info', {
			permissionLevel: PermissionLevel.Cook,
			category: 'staff',
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'user',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, who's info should be pulled??`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a valid user.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { user }: { user: User }) {
		let isStaff = await Staff.exists({ staffID: user.id });
		if (!isStaff) return msg.reply('User provided is not staff');
		let staffInfo = await Staff.findOne({ staffID: user.id })
			.exec()
			.catch(e => console.error(e));
		if (!staffInfo) return msg.reply('An error has occured');
		const embed = new MessageEmbed()
			.setTitle('User Information')
			.addFields([
				{ name: 'User', value: `${user.tag}`, inline: true },
				{ name: 'Rank', value: `${staffInfo.staffRank}`, inline: true },
				{
					name: 'Date Hired',
					value: `${dayjs(staffInfo.dateHired).format('MM/DD/YYYY') || 'N/A'}`,
					inline: true,
				},
				{
					name: 'Most Recent Order',
					value: `${staffInfo.recentOrder || 'N/A'}`,
					inline: true,
				},
				{
					name: 'Orders Accepted',
					value: `${staffInfo.ordersClaimed}`,
					inline: true,
				},
				{
					name: 'Orders Completed',
					value: `${staffInfo.ordersCompleted}`,
					inline: true,
				},
			])
			.setTimestamp()
			.setColor('0x00fc36');
		return msg.reply("Here's the requested info", { embed });
	}
}
