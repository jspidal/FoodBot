import { DocumentType } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { User } from 'discord.js';
import { Blacklist } from '../../../model/blacklist';
import { sendLogMsg } from '../../../util/functions';

export default class UserBlacklistListener extends Listener {
	constructor() {
		super('userBlacklist', {
			emitter: 'client',
			event: 'userBlacklist',
		});
	}

	async exec(doc: DocumentType<Blacklist>, user: User) {
		const admin = this.client.users.cache.get(doc!.admin);
		const embed = new MessageEmbed()
			.setTitle('User Blacklisted')
			.addField('User', `${user.tag} \n(${user.id})`, true)
			.addField('Admin', admin?.tag + ` \n(${admin?.id})`, true)
			.addField('Reason', doc?.reason || 'No reason set')
			.setColor('RED')
			.setTimestamp();
		sendLogMsg(this.client, undefined, embed)?.catch(e => console.error(e));
	}
}
