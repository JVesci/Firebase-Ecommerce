import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { clearCart, removeFromCart } from '../redux/cartSlice'
import type { Product } from '../types'
import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "../firebaseConfig"

const Cart = () => {
    const cartItems = useAppSelector(state => state.cart.items)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Group items by ID
    const groupedItems = new Map<string, { item: Product; quantity: number }>()

    cartItems.forEach(item => {
        if (groupedItems.has(item.id)) {
            const existing = groupedItems.get(item.id)!
            existing.quantity += 1
        } else {
            groupedItems.set(item.id, { item, quantity: 1 })
        }
    })

    const groupedArray = Array.from(groupedItems.values())

    const totalItems = cartItems.length
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

    const handleCheckout = async () => {
        setError(null)
        setSuccess(false)
        const user = auth.currentUser
        if (!user) {
            setError("You must be signed in to checkout.")
            return
        }
        if (cartItems.length === 0) {
            setError("Your cart is empty.")
            return
        }

        setLoading(true)
        try {
            // Prepare order data
            const orderItems = groupedArray.map(({ item, quantity }) => ({
                productId: item.id,
                quantity,
                price: item.price,
            }))

            const orderData = {
                userId: user.uid,
                createdAt: serverTimestamp(),
                total: totalPrice,
                items: orderItems,
            }

            // Add order to Firestore
            await addDoc(collection(db, "orders"), orderData)

            // Clear cart and show success
            dispatch(clearCart())
            setSuccess(true)
        } catch (err) {
            setError("Failed to place order. Please try again.")
            console.error("Checkout error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-center">Shopping Cart</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Order placed successfully!</div>}

            {groupedArray.length === 0 ? (
                <p className="text-center">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="list-group mb-4">
                        {groupedArray.map(({ item, quantity }) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex align-items-center justify-content-between"
                            >
                                <div className="d-flex align-items-center">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            width={50}
                                            className="me-3 rounded"
                                        />
                                    )}
                                    <div>
                                        <h6 className="mb-1">{item.title}</h6>
                                        <small>Qty: {quantity}</small><br />
                                        <small>${(item.price * quantity).toFixed(2)}</small>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="text-end">
                        <p><strong>Total Items:</strong> {totalItems}</p>
                        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
                        <button
                            className="btn btn-success"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart