import { DocumentType } from '@typegoose/typegoose';
import { User } from 'discord.js';
import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Guild } from 'discord.js';
import { FoodClient } from '../../client/foodClient';
import { Order, OrderModel } from '../../model/order';
import { generateId, sendKitchenMsg } from '../../util/functions';
import { OrderStatus } from './orderStatus';

export interface OrderTicketOptions {
	content: string;
	guild: Guild;
	channel: TextChannel;
	user: User;
	client: FoodClient;
}

export class OrderTicket {
	id: string;
	client: FoodClient;
	content: string;

	user: User;
	guild: Guild;
	channel: TextChannel;
	document?: DocumentType<Order>;

	constructor(data: OrderTicketOptions) {
		this.id = generateId();

		this.content = data.content;
		this.client = data.client;

		this.user = data.user;
		this.guild = data.guild;
		this.channel = data.channel;
	}

	async submit() {
		if (!this.guild.available) return;

		const embed = new MessageEmbed()
			.setTitle(`New order from ${this.guild.name} (\`${this.guild.id}\`)`)
			.setDescription(
				`Ordered by: **${this.user.tag}**(\`${this.user.id}\`) \nID: ${this.id} \n \`\`\`${this.content}\`\`\``
			)
			.setFooter('Is this order abusive? Ping an artist manager ASAP')
			.setTimestamp()
			.setColor('0x36B7E1');
		const guildIcon = this.guild.iconURL({ dynamic: true });
		if (guildIcon) {
			embed.setThumbnail(guildIcon);
		}
		this.document = await OrderModel.create({
			_id: this.id,
			content: this.content,
			guild: this.guild.id,
			channel: this.channel.id,
			user: this.user.id,
			status: OrderStatus.WAITING,
		});
		sendKitchenMsg(this.client, undefined, embed);
		return this.document;
	}
}
