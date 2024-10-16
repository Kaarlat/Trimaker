import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    socketid: { type: String, required: true },
    mensaje: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
