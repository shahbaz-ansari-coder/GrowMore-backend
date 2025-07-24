import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://i.pinimg.com/736x/f4/a3/4e/f4a34ef7fd2f8d3a347a8c0dfb73eece.jpg'
    },
    capital_price: {
        type: String,
        default: 100
    },
    loss_price: {
        type: String,
        default: 0
    },
    profit_price: {
        type: String,
        default: 0
    },
    role: {
        type: String, 
        default: "user"
    }
});

const authModel = mongoose.model('account' , authSchema);
export default authModel