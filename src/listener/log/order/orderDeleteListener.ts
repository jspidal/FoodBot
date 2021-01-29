import { DocumentType } from "@typegoose/typegoose";
import { Listener } from "discord-akairo";
import { User, MessageEmbed } from "discord.js";
import { Order } from "../../../model/order";
import { sendLogMsg } from "../../../util/functions";

export default class OrderDeleteListener extends Listener {
    constructor() {
        super('orderDelete', {
            emitter: 'client',
            event: 'orderDelete'
        });
    }

    async exec(order: DocumentType<Order>, user: User, reason: string) {
        const orderer = await this.client.users.fetch(order.user);
        if (!orderer) return;
		const embed = new MessageEmbed()
			.setTitle('Staff Updated')
            .addField('Order', `${order.content} (${order.id})`)
            .addField('Orderer', `${orderer.tag} (${orderer.id})`)
            .addField('Staff', `${user.tag} (${user.id})`)
            .addField('Reason', `${reason}`)
			.setTimestamp()
			.setColor('BLUE');
		sendLogMsg(this.client, undefined, embed);
    }
}