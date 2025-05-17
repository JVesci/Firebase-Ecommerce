import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Product } from '../types'
import { useAppDispatch } from '../redux/hooks'
import { addToCart } from '../redux/cartSlice'
import { useState } from 'react'

const ProductList = () => {
    const dispatch = useAppDispatch()
    const [category, setCategory] = useState('')
    const [showToast, setShowToast] = useState(false)

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axios.get<string[]>('https://fakestoreapi.com/products/categories')
            return res.data
        }
    })

    const { data: products, isLoading } = useQuery({
        queryKey: ['products', category],
        queryFn: async () => {
            const url = category
                ? `https://fakestoreapi.com/products/category/${category}`
                : 'https://fakestoreapi.com/products'
            const res = await axios.get<Product[]>(url)
            return res.data
        }
    })

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product))
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
    }

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const stars = []

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>)
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="bi bi-star-half text-warning"></i>)
        }

        while (stars.length < 5) {
            stars.push(<i key={`empty-${stars.length}`} className="bi bi-star text-warning"></i>)
        }

        return stars
    }

    if (isLoading) return <p>Loading...</p>

    return (
        <div className="container my-4">
            <div className="mb-4">
                <select className="form-select" onChange={e => setCategory(e.target.value)} value={category}>
                    <option value=''>All</option>
                    {categories?.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="row">
                {products?.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={product.image}
                                className="card-img-top p-3"
                                alt={product.title}
                                style={{ height: '200px', objectFit: 'contain' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text">${product.price.toFixed(2)}</p>
                                <p className="card-text text-muted">{product.category}</p>
                                <p className="card-text small">{product.description}</p>
                                <p className="card-text">
                                    {renderStars(product.rating.rate)}
                                    <br />
                                    <span className="text-muted small">({product.rating.count} remaining)</span>
                                </p>
                                <button className="btn btn-primary mt-auto" onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showToast && (
                <div className="toast-center">
                    Item added to cart!
                </div>
            )}
        </div>
    )
}

export default ProductList