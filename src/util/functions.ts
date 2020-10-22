import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { FoodClient } from '../client/foodClient';

export function generateId(): string {
	let result = '';
	const chars = 'abcdefghijklmnopqrstuvwxyz';
	const charsLength = chars.length;
	for (let i = 0; i < 3; i++) {
		result += chars.charAt(Math.floor(Math.random() * charsLength));
	}
	return result;
}

export function sendKitchenMsg(
	client: FoodClient,
	content?: string,
	embed?: MessageEmbed
) {
	const channel = client.channels.cache.get(process.env.KITCHEN!) as TextChannel;
	if (!channel) return;
	if (!content) {
		if (!embed) throw new SyntaxError('Missing Message Content');
		else {
			return channel.send(embed);
		}
	}
	if (embed) {
		return channel.send(content, embed);
	}
	return channel.send(content);
}
