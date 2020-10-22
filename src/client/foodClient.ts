import {
	AkairoClient,
	Command,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
} from 'discord-akairo';
import { Mongoose } from 'mongoose';
import { foodClientOptions } from './foodClientOptions';
import { MESSAGES } from '../util/constants';
import { OrderModel } from '../model/order';
import { OrderStatus } from '../struct/order/orderStatus';

export class FoodClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;

	mongo?: Mongoose;

	constructor(options: foodClientOptions) {
		super(
			{
				ownerID: options.ownerID,
			},
			{
				disableMentions: 'everyone',
			}
		);

		this.mongo = options.mongo;

		this.commandHandler = new CommandHandler(this, {
			directory: './src/command',
			prefix: ';',
			argumentDefaults: {
				prompt: {
					modifyRetry: (_, str) =>
						MESSAGES.commandHandler.prompt.modifyRetry(str),
					modifyStart: (_, str) =>
						MESSAGES.commandHandler.prompt.modifyStart(str),
					timeout: MESSAGES.commandHandler.prompt.timeout,
					ended: MESSAGES.commandHandler.prompt.ended,
					cancel: MESSAGES.commandHandler.prompt.cancel,
					retries: 3,
					time: 30000,
				},
			},
			allowMention: true,
		});

		this.commandHandler.resolver.addType(
			'unclaimedOrder',
			async (_message, phrase) => {
				if (!phrase || phrase.length > 3) return null;
				const unclaimedOrderExists = await OrderModel.findOne({
					_id: phrase.toLowerCase(),
					status: OrderStatus.WAITING,
				}).exec();
				return unclaimedOrderExists || null;
			}
		);

		this.commandHandler.resolver.addType(
			'claimedOrder',
			async (_msg, phrase) => {
				if (!phrase || phrase.length > 3) return null;
				const claimedOrderExists = await OrderModel.findOne({
					_id: phrase.toLowerCase(),
					status: OrderStatus.CLAIMED,
				});
				return claimedOrderExists || null;
			}
		);

		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listener/',
		});

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './src/inhibitor',
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
	}

	start(token: string): void {
		super.login(token);
	}
}

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		ownerIds: string[] | undefined;

		start(token: string): void;
	}
}
