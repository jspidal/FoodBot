import { DocumentType } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Guild } from 'discord.js';
import { Blacklist } from '../../../model/blacklist';
import { sendLogMsg } from '../../../util/functions';

export default class GuildBlacklistListener extends Listener {
	constructor() {
		super('guildBlacklist', {
			emitter: 'client',
			event: 'guildBlacklist',
		});
	}

	async exec(doc: DocumentType<Blacklist>, guild: Guild) {
		const admin = this.client.users.cache.get(doc!.admin);
		const embed = new MessageEmbed()
			.setTitle('Guild Blacklisted')
			.addField('Guild', `${guild.name} \n(${guild.id})`, true)
			.addField('Admin', admin?.tag + ` \n(${admin?.id})`, true)
			.addField('Reason', doc?.reason || 'No reason set')
			.setColor('RED')
			.setTimestamp();
		sendLogMsg(this.client, undefined, embed)?.catch(e => console.error(e));
	}
}
