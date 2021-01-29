import { DocumentType } from '@typegoose/typegoose';
import { User } from 'discord.js';
import { Guild } from 'discord.js';
import { ClientEvents } from 'discord.js';
import { Blacklist } from '../model/blacklist';
import { Order } from '../model/order';
import { Staff } from '../model/staff';

export default interface FoodClientEvents extends ClientEvents {
	userBlacklist: [DocumentType<Blacklist>, User];
	userUnblacklist: [DocumentType<Blacklist>, User, string];
	guildBlacklist: [DocumentType<Blacklist>, Guild];
	guildUnblacklist: [DocumentType<Blacklist>, Guild, string];
	staffAdd: [DocumentType<Staff>, User];
	staffRemove: [DocumentType<Staff>, User];
	staffUpdate: [DocumentType<Staff>, User, string];
	orderDelete: [DocumentType<Order>, User, string];
}

export type FoodClientEvent = keyof FoodClientEvents;
