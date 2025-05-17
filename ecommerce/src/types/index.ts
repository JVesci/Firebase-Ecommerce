export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    quantity?: number
    rating: {
        rate: number
        count: number
    }
}

export interface CartItem extends Product {
    quantity: number
}