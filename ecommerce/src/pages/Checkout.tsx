import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

interface CheckoutProps {
    cart: CartItem[];
    clearCart: () => void;
}

const Checkout = ({ cart, clearCart }: CheckoutProps) => {
    const [loading, setLoading] = useState(false);

    const calculateTotal = () =>
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const userId = auth.currentUser?.uid;

            if (!userId) {
                throw new Error("User not logged in.");
            }

            const order = {
                userId,
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: calculateTotal(),
                createdAt: Timestamp.now(),
            };

            await addDoc(collection(db, "orders"), order);
            clearCart();
            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("There was a problem placing your order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <p>Total: ${calculateTotal().toFixed(2)}</p>
            <button onClick={handlePlaceOrder} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
};

export default Checkout;