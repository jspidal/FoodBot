import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { FoodClient } from '../../client/foodClient';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { FoodCommandOptions } from './foodCommandOptions';

export class FoodBotCommand extends Command {
	permissionLevel: PermissionLevel;

	constructor(id: string, options?: FoodCommandOptions) {
		super(id, options);

		this.permissionLevel = options?.permissionLevel || PermissionLevel.Everyone;

		this.userPermissions = async (msg: Message) => {
			if (msg.member) {
				let permLevel = await getPermissionLevel(msg.author.id, this.client);
				if (permLevel < this.permissionLevel) {
					return this.permissionLevel;
				}
				return null;
			}
		};
	}
}
