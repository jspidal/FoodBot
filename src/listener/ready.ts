import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	async exec() {
		console.log(`Logged in as ${this.client.user?.tag}`);
		this.client.user?.setActivity(`the kitchen`, {
			type: 'WATCHING',
		});
	}
}
