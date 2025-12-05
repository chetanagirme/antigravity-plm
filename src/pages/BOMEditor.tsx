import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type BOM, type BOMComponent } from '../types';
import { calculateBOMCost, calculateRecursiveBOMCost } from '../lib/calculations';

import { useToast } from '../context/ToastContext';

const BOMEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { boms, products, addBOM, updateBOM, currentUser } = useStore();
    const { success, error } = useToast();
    const isEditing = Boolean(id);
    const [formData, setFormData] = useState<Partial<BOM>>({
        name: '',
        productId: '',
        version: '1.0',
        status: 'Draft',
        components: [],
    });

    const isReadOnly = isEditing && formData.status !== 'Draft' && currentUser?.role !== 'ADMIN';

    useEffect(() => {
        if (isEditing && id) {
            const bom = boms.find((b) => b.id === id);
            if (bom) {
                setFormData(bom);
            }
        } else {
            setFormData({
                name: '',
                productId: '',
                version: '1.0',
                status: 'Draft',
                components: [],
            });
        }
    }, [isEditing, id, boms]);

    const handleAddComponent = () => {
        const newComponent: BOMComponent = {
            id: crypto.randomUUID(),
            componentProductId: '',
            quantity: 1,
            unit: 'pcs',
        };
        setFormData({
            ...formData,
            components: [...(formData.components || []), newComponent],
        });
    };

    const handleUpdateComponent = (componentId: string, field: keyof BOMComponent, value: any) => {
        setFormData({
            ...formData,
            components: formData.components?.map((c) =>
                c.id === componentId ? { ...c, [field]: value } : c
            ),
        });
    };

    const handleRemoveComponent = (componentId: string) => {
        setFormData({
            ...formData,
            components: formData.components?.filter((c) => c.id !== componentId),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();

        try {
            if (isEditing && id) {
                await updateBOM(id, { ...formData, updatedAt: now });
                success('BOM updated successfully');
            } else {
                await addBOM({
                    ...formData,
                    id: crypto.randomUUID(),
                    createdAt: now,
                    updatedAt: now,
                } as BOM);
                success('BOM created successfully');
            }
            navigate('/boms');
        } catch (err: any) {
            console.error('Error saving BOM:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save BOM';
            error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/boms" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEditing ? 'Edit BOM' : 'New BOM'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/boms"
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    {!isReadOnly && (
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save BOM</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">BOM Name</label>
                        <input
                            type="text"
                            required
                            disabled={isReadOnly}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Product</label>
                        <select
                            required
                            disabled={isReadOnly}
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.sku})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Version</label>
                        <input
                            type="text"
                            required
                            disabled={isReadOnly}
                            value={formData.version}
                            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            disabled={isReadOnly}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Approved">Approved</option>
                            <option value="Obsolete">Obsolete</option>
                        </select>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold text-slate-800">Components</h3>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                    Flat Cost: ₹{calculateBOMCost(formData as BOM, products).toFixed(2)}
                                </div>
                                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                    Rolled-up Cost: ₹{calculateRecursiveBOMCost(formData as BOM, products, boms).toFixed(2)}
                                </div>
                            </div>
                        </div>
                        {!isReadOnly && (
                            <button
                                type="button"
                                onClick={handleAddComponent}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Component</span>
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {formData.components?.map((component) => (
                            <div key={component.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Component</label>
                                        <select
                                            required
                                            disabled={isReadOnly}
                                            value={component.componentProductId}
                                            onChange={(e) => handleUpdateComponent(component.id, 'componentProductId', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        >
                                            <option value="">Select Component</option>
                                            {products.filter(p => p.id !== formData.productId).map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.sku})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Quantity</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            disabled={isReadOnly}
                                            value={component.quantity}
                                            onChange={(e) => handleUpdateComponent(component.id, 'quantity', parseFloat(e.target.value))}
                                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Unit</label>
                                        <input
                                            type="text"
                                            disabled={isReadOnly}
                                            value={component.unit}
                                            onChange={(e) => handleUpdateComponent(component.id, 'unit', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        />
                                    </div>
                                </div>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveComponent(component.id)}
                                        className="mt-6 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {formData.components?.length === 0 && (
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                No components added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default BOMEditor;
