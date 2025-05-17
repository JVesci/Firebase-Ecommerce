import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { clearCart, removeFromCart } from '../redux/cartSlice'
import type { Product } from '../types'

const Cart = () => {
    const cartItems = useAppSelector(state => state.cart.items)
    const dispatch = useAppDispatch()

    // Group items by ID to calculate quantity
    const groupedItems: Record<number, { item: Product; quantity: number }> = {}

    cartItems.forEach(item => {
        if (groupedItems[item.id]) {
            groupedItems[item.id].quantity += 1
        } else {
            groupedItems[item.id] = { item, quantity: 1 }
        }
    })

    const groupedArray = Object.values(groupedItems)

    const totalItems = cartItems.length
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

    return (
        <div className="container my-4">
            <h2>Shopping Cart</h2>
            {groupedArray.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="list-group mb-3">
                    {groupedArray.map(({ item, quantity }) => (
                        <li key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <img src={item.image} alt={item.title} width={50} className="me-3" />
                                <div>
                                    <strong>{item.title}</strong><br />
                                    <span>Qty: {quantity}</span><br />
                                    <span>${(item.price * quantity).toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart(item.id))}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <p><strong>Total Items:</strong> {totalItems}</p>
            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
            <button className="btn btn-success" onClick={() => dispatch(clearCart())}>Checkout</button>
        </div>
    )
}

export default Cart