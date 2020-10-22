import { PermissionLevel } from '../../util/permission/permissionLevel';
import { CommandOptions } from 'discord-akairo';

interface CustomOptions {
	permissionLevel?: PermissionLevel;
}

export type FoodCommandOptions = CustomOptions & CommandOptions;
