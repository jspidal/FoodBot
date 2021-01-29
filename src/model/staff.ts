import { getModelForClass, prop } from '@typegoose/typegoose';

export class Staff {
	@prop({ required: true, type: String })
	public staffID!: string;

	@prop({ required: true, type: String })
	public staffRank!: string;

	@prop({ required: true, type: Date })
	public dateHired!: Date;

	@prop({ required: true, type: String })
	public hiredBy!: string;

	@prop({ required: false, type: Date })
	public recentOrder?: Date;

	@prop({ required: true, type: Number })
	public ordersClaimed!: number;

	@prop({ required: true, type: Number })
	public ordersCompleted!: number;
}

export const StaffModel = getModelForClass(Staff);
