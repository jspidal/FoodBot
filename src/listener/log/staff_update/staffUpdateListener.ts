import { DocumentType } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { User, MessageEmbed } from 'discord.js';
import { Staff } from '../../../model/staff';
import { sendLogMsg } from '../../../util/functions';

export default class StaffAddListener extends Listener {
	constructor() {
		super('staffUpdate', {
			emitter: 'client',
			event: 'staffUpdate',
		});
	}

	async exec(doc: DocumentType<Staff>, user: User, oldRank: string) {
		const admin = this.client.users.cache.get(doc.hiredBy);

		const embed = new MessageEmbed()
			.setTitle('Staff Updated')
			.addField('User', `${user.tag} (${user.id})`, false)
            .addField('Admin', `${admin?.tag} (${admin?.id})`, false)
            .addField('Old Rank', `${oldRank}`, true)
            .addField('New Rank', `${doc.staffRank}`, true)
			.setThumbnail(user.displayAvatarURL())
			.setTimestamp()
			.setColor('BLUE');
		sendLogMsg(this.client, undefined, embed);
	}
}
