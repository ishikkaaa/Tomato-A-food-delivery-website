import userModel from "../models/userModel.js";

// Add items to user cart function
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "userId and itemId are required!" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        let cartData = userData.cartData || {};  // Ensure cartData exists
        cartData[itemId] = cartData[itemId] ? cartData[itemId] + 1 : 1;  // Add item or increment

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

        res.json({ success: true, message: "Added to cart!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error!" });
    }
}

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "userId and itemId are required!" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        let cartData = { ...userData.cartData };
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];  // Remove item if quantity is 0
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

        res.json({ success: true, message: "Removed successfully!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error!" });
    }
}

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Invalid input: userId is required!" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const cartData = userData.cartData || {};  // Default to empty cart if no data
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the cart data." });
    }
};

export { addToCart, removeFromCart, getCart };
