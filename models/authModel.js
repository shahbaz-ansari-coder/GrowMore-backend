import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    coinName: { type: String, required: true },        
    coinShortName: { type: String, required: true }, 
    coinImage: { type: String, required: true }, 

    buyDate: { type: String, required: true },
    buyTime: { type: String, required: true },      
    buyPrice: { type: Number, required: true },   
    buyAmount: { type: Number, required: true },     
    buyTotal: { type: Number, required: true },

    pnl: { type: Number, default: 0 },                 
    status: { type: String, default: "OPEN" },        

    sellDate: { type: String },               
    sellTime: { type: String },                    
    sellPrice: { type: Number },             
    sellAmount: { type: Number },                  
    sellTotal: { type: Number },                    
    returnPercentage: { type: Number }          
});

const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    messages: [
        {
            text: { type: String, required: true },
            sentAt: { type: Date, default: Date.now },
        }
    ],
    avatar: {
        type: String,
        default: 'https://i.pinimg.com/736x/f4/a3/4e/f4a34ef7fd2f8d3a347a8c0dfb73eece.jpg'
    },
    capital_price: { type: String, default: 100 },
    loss_price: { type: String, default: 0 },
    profit_price: { type: String, default: 0 },
    is_blocked: { type: Boolean, default: false },
    is_online: { type: Boolean, default: false },
    role: { type: String, default: "user" },

    trades: [tradeSchema]
});

const authModel = mongoose.model('account', authSchema);
export default authModel;
