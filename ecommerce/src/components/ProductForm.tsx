import { useState, useEffect } from 'react';
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Product } from '../types';

interface ProductFormData {
    title: string;
    price: string;
    description: string;
    category: string;
    image: string;
    quantity: string;
}

interface ProductFormProps {
    existingProduct?: Product | null;
    onSave?: () => void;
    onSuccess?: () => void;
}

const initialFormData: ProductFormData = {
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    quantity: '0',
};

const ProductForm = ({ existingProduct, onSave, onSuccess }: ProductFormProps) => {
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);

    useEffect(() => {
        if (existingProduct) {
            setFormData({
                title: existingProduct.title || '',
                price: existingProduct.price.toString(),
                description: existingProduct.description || '',
                category: existingProduct.category || '',
                image: existingProduct.image || '',
                quantity: existingProduct.quantity?.toString() || '0',
            });
        } else {
            setFormData(initialFormData);
        }
    }, [existingProduct]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
            };

            if (existingProduct?.id) {
                const productRef = doc(db, 'products', existingProduct.id);
                await updateDoc(productRef, parsedData);
            } else {
                await addDoc(collection(db, 'products'), parsedData);
            }

            onSave?.();
            onSuccess?.();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">{existingProduct ? 'Edit Product' : 'Add Product'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            className="form-control"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                            type="url"
                            className="form-control"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {existingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;