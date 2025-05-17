import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../types'

interface CartItem extends Product {
    quantity: number
}

const initialState: { items: CartItem[] } = {
    items: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<Product>) {
            const product = action.payload
            const existingItem = state.items.find(item => item.id === product.id)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...product, quantity: 1 })
            }
        },
        removeFromCart(state, action: PayloadAction<number>) {
            const id = action.payload
            const index = state.items.findIndex(item => item.id === id)
            if (index !== -1) {
                if (state.items[index].quantity > 1) {
                    state.items[index].quantity -= 1
                } else {
                    state.items.splice(index, 1)
                }
            }
        },
        clearCart(state) {
            state.items = []
        }
    }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer