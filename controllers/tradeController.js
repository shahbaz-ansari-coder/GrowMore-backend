import authModel from "../models/authModel.js";

// ✅ Buy Coin API
export const buyCoin = async (req, res) => {
    try {
        const { userId, coinName, coinImage, coinShortName, buyPrice, buyAmount } = req.body;

        // ✅ Check required fields
        if (!userId || !coinName || !coinShortName || !buyPrice || !buyAmount || !coinImage) {
            return res.status(400).json({ message: "userId, coinName, coinShortName, buyPrice and buyAmount are required" });
        }

        // ✅ Calculate total cost of purchase
        const buyTotal = buyPrice * buyAmount;

        // ✅ Get user
        const user = await authModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Convert capital_price (String → Number)
        const currentCapital = Number(user.capital_price);

        // ✅ Check balance
        if (currentCapital < buyTotal) {
            return res.status(400).json({ message: "❌ Insufficient balance to buy this coin" });
        }

        // ✅ Get date & time
        const now = new Date();
        const buyDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const buyTime = now.toLocaleTimeString();        // HH:MM:SS

        // ✅ New trade object
        const newTrade = {
            coinName,
            coinShortName,
            coinImage,
            buyDate,
            buyTime,
            buyPrice,
            buyAmount,
            buyTotal,
            status: "OPEN"
        };

        // ✅ Push trade to user
        user.trades.push(newTrade);

        // ✅ Deduct money from capital
        user.capital_price = String(currentCapital - buyTotal);

        // ✅ Save updated user
        await user.save();

        return res.status(201).json({
            message: "✅ Coin bought successfully",
            remainingCapital: user.capital_price,
            trade: newTrade
        });

    } catch (error) {
        console.error("❌ Error buying coin:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};



// ✅ Sell Coin API
export const sellCoin = async (req, res) => {
    try {
        const { userId, tradeId, sellPrice, sellAmount } = req.body;

        if (!userId || !tradeId || !sellPrice || !sellAmount) {
            return res.status(400).json({ message: "userId, tradeId, sellPrice and sellAmount are required" });
        }

        // ✅ Get user
        const user = await authModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Find the trade
        const trade = user.trades.id(tradeId);
        if (!trade) return res.status(404).json({ message: "Trade not found" });
        if (trade.status === "CLOSED") return res.status(400).json({ message: "Trade already closed" });

        // ✅ Calculate sell total
        const sellTotal = sellPrice * sellAmount;

        // ✅ Calculate PnL (Profit/Loss)
        const pnl = sellTotal - trade.buyTotal;

        // ✅ Calculate return percentage
        const returnPercentage = (pnl / trade.buyTotal) * 100;

        // ✅ Update trade
        const now = new Date();
        trade.sellDate = now.toISOString().split("T")[0];
        trade.sellTime = now.toLocaleTimeString();
        trade.sellPrice = sellPrice;
        trade.sellAmount = sellAmount;
        trade.sellTotal = sellTotal;
        trade.pnl = pnl;
        trade.returnPercentage = returnPercentage;
        trade.status = "CLOSED";

        // ✅ Update user's capital_price
        let capital = Number(user.capital_price);
        capital += sellTotal; // Add money back to capital
        user.capital_price = String(capital);

        // ✅ Update profit_price or loss_price
        if (pnl >= 0) {
            let currentProfit = Number(user.profit_price);
            user.profit_price = String(currentProfit + pnl);
        } else {
            let currentLoss = Number(user.loss_price);
            user.loss_price = String(currentLoss + Math.abs(pnl));
        }

        // ✅ Save user
        await user.save();

        return res.status(200).json({
            message: "✅ Coin sold successfully",
            trade,
            capital_price: user.capital_price,
            profit_price: user.profit_price,
            loss_price: user.loss_price
        });

    } catch (error) {
        console.error("❌ Error selling coin:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Get all trades for a user
export const getAllTrades = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // ✅ Get user
        const user = await authModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            message: "✅ All trades fetched successfully",
            trades: user.trades,
            balance: user.capital_price
        });

    } catch (error) {
        console.error("❌ Error fetching trades:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


