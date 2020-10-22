import { getModelForClass, prop } from '@typegoose/typegoose';

export class Order {
	@prop({ required: true, type: String })
	_id!: string;

	@prop({ required: true, type: String })
	content!: string;

	@prop({ required: true, type: String })
	guild!: string;

	@prop({ required: true, type: String })
	channel!: string;

	@prop({ required: true, type: String })
	user!: string;

	@prop({ required: true, type: String })
	status!: string;
}

export const OrderModel = getModelForClass(Order);
