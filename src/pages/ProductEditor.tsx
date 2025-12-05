import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToast } from '../context/ToastContext';
import { type Product, type ProductStatus } from '../types';

const ProductEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addProduct, updateProduct, products, currentUser } = useStore();
    const { success, error } = useToast();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        sku: '',
        description: '',
        cost: 0,
        price: 0,
        status: 'Draft',
        category: 'Electronics',
    });

    useEffect(() => {
        if (isEditing && id) {
            const product = products.find((p) => p.id === id);
            if (product) {
                setFormData(product);
            }
        }
    }, [isEditing, id, products]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) return;

        try {
            if (isEditing && id) {
                updateProduct(id, formData);
                success('Product updated successfully');
            } else {
                addProduct({
                    ...formData,
                } as Product);
                success('Product created successfully');
            }
            navigate('/products');
        } catch (err) {
            error('Failed to save product');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/products" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEditing ? 'Edit Product' : 'New Product'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/products"
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Product</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">SKU</label>
                        <input
                            type="text"
                            required
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Active">Active</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Cost (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Price (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ProductEditor;
