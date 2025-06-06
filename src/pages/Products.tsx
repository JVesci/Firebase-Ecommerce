import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { fetchProducts, deleteProduct } from '../services/firebaseProductService';
import ProductForm from '../components/ProductForm';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
        setSelectedProduct(null);
        setShowForm(false);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    const handleSaveSuccess = () => {
        loadProducts();
    };

    return (
        <div className="container my-4">
            <h2>Products</h2>

            <button className="btn btn-primary mb-3" onClick={handleAdd}>
                Add New Product
            </button>

            {showForm && (
                <ProductForm existingProduct={selectedProduct} onSave={handleSaveSuccess} />
            )}

            <ul className="list-group">
                {products.map((product) => (
                    <li
                        key={product.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{product.title}</strong> - ${product.price.toFixed(2)} (Qty: {product.quantity})<br />
                            <small>Category: {product.category}</small>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEdit(product)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(product.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;