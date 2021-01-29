import { Message } from "discord.js";
import { OrderModel } from "../../model/order";
import { FoodBotCommand } from "../../struct/command/foodCommand";

export default class DeleteCommand extends FoodBotCommand {
    constructor() {
        super('delete', {
            aliases: ['delete'],
            category: 'ordering'
        })
    }

    async exec(msg: Message) {
        const order = OrderModel.findByIdAndDelete({user: msg.author.id});
        if (order) {
            return msg.channel.send('Your order has been deleted')
        }
    }
}