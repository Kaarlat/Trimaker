import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // Referencia al modelo Event
            quantity: { type: Number, default: 1, min: 1 } // Cantidad del producto
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
