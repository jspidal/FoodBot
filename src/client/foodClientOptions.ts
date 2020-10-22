import { Mongoose } from 'mongoose';

export interface foodClientOptions {
	prefix?: string;
	mongo?: Mongoose;
	ownerID?: string;
}
