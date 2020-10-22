import { Listener } from 'discord-akairo';

export default class CommandError extends Listener {
	constructor() {
		super('commandError', {
			emitter: 'commandHandler',
			event: 'error',
		});
	}

	async exec(e: Error) {
		console.error(e);
	}
}
