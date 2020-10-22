import { getModelForClass, prop } from '@typegoose/typegoose';

export class Blacklist {
	@prop({ required: true, type: String })
	_id!: string;

	@prop({ required: true, type: String })
	admin!: string;

	@prop({ required: true, type: Date })
	date!: Date;

	@prop({ required: false, type: String })
	reason?: string;
}

export const BlacklistModel = getModelForClass(Blacklist);
