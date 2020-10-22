import { mongoose } from '@typegoose/typegoose';
import { FoodClient } from './client/foodClient';

require('dotenv').config();

(async () => {
	const connection = await mongoose.connect(process.env.MONGO_URI!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const client: FoodClient = new FoodClient({
		prefix: process.env.PREIFX || ';',
		mongo: connection,
		ownerID: '283739077507809288'
	});
	client.start(process.env.TOKEN!);
})();
