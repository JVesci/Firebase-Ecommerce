import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db, auth } from "../firebaseConfig"

interface OrderItem {
    productId: string
    quantity: number
    price: number
}

interface Order {
    id: string
    userId: string
    createdAt: any // Firestore Timestamp
    total: number
    items: OrderItem[]
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            if (!auth.currentUser) {
                setOrders([])
                setLoading(false)
                return
            }

            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", auth.currentUser.uid)
                    // No orderBy to avoid composite index requirement
                )

                const querySnapshot = await getDocs(q)
                const ordersData = querySnapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        userId: data.userId,
                        createdAt: data.createdAt,
                        total: data.total,
                        items: data.items,
                    } as Order
                })

                setOrders(ordersData)
            } catch (error) {
                console.error("Failed to fetch orders:", error)
                setOrders([])
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    if (loading) {
        return <p className="text-center mt-4">Loading orders...</p>
    }

    if (orders.length === 0) {
        return <p className="text-center mt-4">No orders found.</p>
    }

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-center">Order History</h2>
            <ul className="list-group">
                {orders.map(order => (
                    <li key={order.id} className="list-group-item mb-3">
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p>
                            <strong>Order Date:</strong>{" "}
                            {order.createdAt?.toDate
                                ? order.createdAt.toDate().toLocaleString()
                                : "N/A"}
                        </p>
                        <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
                        <div>
                            <strong>Items:</strong>
                            <ul>
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        Product ID: {item.productId}, Qty: {item.quantity}, Price: ${item.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrderHistory