import { DocumentType } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { User, MessageEmbed } from 'discord.js';
import { Staff } from '../../../model/staff';
import { sendLogMsg } from '../../../util/functions';

export default class StaffAddListener extends Listener {
	constructor() {
		super('staffAdd', {
			emitter: 'client',
			event: 'staffAdd',
		});
	}

	async exec(doc: DocumentType<Staff>, user: User) {
		const admin = this.client.users.cache.get(doc.hiredBy);

		const embed = new MessageEmbed()
			.setTitle('New Staff Added')
			.addField('User', `${user.tag} (${user.id})`)
			.addField('Admin', `${admin?.tag} (${admin?.id})`)
			.setThumbnail(user.displayAvatarURL())
			.setTimestamp()
			.setColor('BLUE');
		sendLogMsg(this.client, undefined, embed);
	}
}
