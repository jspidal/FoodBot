import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { FoodBotCommand } from '../../../../struct/command/foodCommand';

export default class StaffCommand extends FoodBotCommand {
	constructor() {
		super('staff', {
			aliases: ['staff'],
			category: 'staff',
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [
				['staff-promote', 'promote'],
				['staff-demote', 'demote'],
				['staff-info', 'info'],
				['staff-remove', 'remove'],
				['staff-set', 'set'],
				['staff-add', 'add'],
			],
			otherwise: (msg: Message) => {
				msg.reply(
					`${this.handler.prefix}staff <promote/demote/info/remove/set/add> <user>`
				);
			},
		};
		return Flag.continue(method);
	}
	/*
    async exec(msg: Message, {action, inputUser, inputRank}: {action: string, inputUser: User, inputRank: string}) {
        switch (action) {
            case 'promote':
                let nextRank: string = await promote(inputUser.id, (this.client))
                return msg.reply(`User has been promoted to ${nextRank}`)
            
            case 'demote':
                let prevRank: string = await demote(inputUser.id, (this.client))
                return msg.reply(`User has been promoted to ${prevRank}`)
            
            case 'info':
                break;
            
            case 'remove':
                break;
            
            case 'set':
                break;
            
            case 'add':
                break;
        }
    }
    */
}
