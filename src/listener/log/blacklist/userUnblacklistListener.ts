import { DocumentType } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { User } from 'discord.js';
import { Blacklist } from '../../../model/blacklist';
import { sendLogMsg } from '../../../util/functions';

export default class UserUnblacklistListener extends Listener {
	constructor() {
		super('userUnblacklist', {
			emitter: 'client',
			event: 'userUnblacklist',
		});
	}

	async exec(doc: DocumentType<Blacklist>, user: User, reason: string) {
		const admin = this.client.users.cache.get(doc!.admin);
		const embed = new MessageEmbed()
			.setTitle('User Blacklisted')
			.addField('User', `${user.tag} \n(${user.id})`, true)
			.addField('Admin', admin?.tag + ` \n(${admin?.id})`, true)
			.addField('Reason', reason || 'No reason set')
			.setColor('RED')
			.setTimestamp();
		sendLogMsg(this.client, undefined, embed)?.catch(e => console.error(e));
	}
}
