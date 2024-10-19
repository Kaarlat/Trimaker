import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true }
});

eventSchema.plugin(mongoosePaginate);

const Event = mongoose.model('Event', eventSchema);

export const createEvent = async (data) => {
    const newEvent = new Event(data);
    return await newEvent.save();
};

export const getEvents = async () => {
    return await Event.find();
};

export const deleteEvent = async (id) => {
    return await Event.findByIdAndDelete(id);
};

export default Event;
