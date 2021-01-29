import { DocumentType } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Guild } from 'discord.js';
import { Blacklist } from '../../../model/blacklist';
import { sendLogMsg } from '../../../util/functions';

export default class GuildUnblacklistListener extends Listener {
	constructor() {
		super('guildUnblacklist', {
			emitter: 'client',
			event: 'guildUnblacklist',
		});
	}

	async exec(doc: DocumentType<Blacklist>, guild: Guild, reason: string) {
		const admin = this.client.users.cache.get(doc!.admin);
		const embed = new MessageEmbed()
			.setTitle('Guild Unblacklisted')
			.addField('Guild', `${guild.name} \n(${guild.id})`, true)
			.addField('Admin', admin?.tag + ` \n(${admin?.id})`, true)
			.addField('Reason', reason || 'No reason set')
			.setColor('RED')
			.setThumbnail(guild.iconURL() || '')
			.setTimestamp();
		sendLogMsg(this.client, undefined, embed)?.catch(e => console.error(e));
	}
}
