import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

// Load cart from sessionStorage
const loadCartFromSession = () => {
    try {
        const serializedCart = sessionStorage.getItem('cart')
        if (serializedCart === null) return { items: [] }
        return { items: JSON.parse(serializedCart) }
    } catch (e) {
        console.error('Failed to load cart from sessionStorage:', e)
        return { items: [] }
    }
}

const preloadedState = {
    cart: loadCartFromSession(),
}

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    preloadedState,
})

// Save cart to sessionStorage whenever it changes
store.subscribe(() => {
    try {
        const cartState = store.getState().cart
        sessionStorage.setItem('cart', JSON.stringify(cartState.items))
    } catch (e) {
        console.error('Failed to save cart to sessionStorage:', e)
    }
})

// Export types for use in hooks and components
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
