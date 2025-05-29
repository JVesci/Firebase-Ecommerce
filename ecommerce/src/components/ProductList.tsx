import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/firebaseProductService';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/cartSlice';

type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    image?: string;
};

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            const products: Product[] = data.map((item: any) => ({
                id: item.id,
                title: item.title ?? '',
                description: item.description ?? '',
                price: item.price ?? 0,
                quantity: item.quantity ?? 0,
                category: item.category ?? '',
                image: item.image ?? undefined,
            }));
            setProducts(products);
        };
        loadProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000); // hide after 2 seconds
    };

    return (
        <div className="container my-4 position-relative">
            {showSuccessMessage && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        zIndex: 1050,
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        textAlign: 'center',
                    }}
                >
                    Successfully added to cart!
                </div>
            )}

            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100">
                            {product.image && (
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.title}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                            )}
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text">{product.description}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p><strong>Category:</strong> {product.category}</p>
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.quantity === 0}
                                >
                                    {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;