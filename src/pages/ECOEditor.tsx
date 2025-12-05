import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Send, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type ECO, type ECOPriority, type ECOStatus } from '../types';

import { useToast } from '../context/ToastContext';

const ECOEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { ecos, products, addECO, updateECO, deleteECO, currentUser } = useStore();
    const { success, error } = useToast();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<ECO>>({
        title: '',
        description: '',
        productIds: [],
        priority: 'Medium',
        status: 'Draft',
    });

    useEffect(() => {
        if (isEditing && id) {
            const eco = ecos.find((e) => e.id === id);
            if (eco) {
                setFormData(eco);
            }
        }
    }, [isEditing, id, ecos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();

        try {
            if (isEditing && id) {
                await updateECO(id, { ...formData, updatedAt: now });
                success('ECO updated successfully');
            } else {
                if (!currentUser) return;
                await addECO({
                    ...formData,
                    id: crypto.randomUUID(),
                    initiatorId: currentUser.id,
                    createdAt: now,
                    updatedAt: now,
                } as ECO);
                success('ECO created successfully');
            }
            navigate('/ecos');
        } catch (err: any) {
            console.error('Error saving ECO:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save ECO';
            error(errorMessage);
        }
    };

    const handleStatusChange = (newStatus: ECOStatus) => {
        if (!id) return;
        updateECO(id, { status: newStatus, approverId: currentUser?.id });
        navigate('/ecos');
    };

    const handleDelete = () => {
        if (id && window.confirm('Are you sure you want to delete this ECO?')) {
            deleteECO(id);
            navigate('/ecos');
        }
    };

    const toggleProduct = (productId: string) => {
        const currentIds = formData.productIds || [];
        const newIds = currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId];
        setFormData({ ...formData, productIds: newIds });
    };

    const canEdit = currentUser?.role === 'ENGINEER' && formData.status === 'Draft' || currentUser?.role === 'ADMIN';
    const canApprove = (currentUser?.role === 'MANAGER' || currentUser?.role === 'DGM' || currentUser?.role === 'ADMIN') && formData.status === 'Pending Review';

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/ecos" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEditing ? 'Edit ECO' : 'New ECO'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Workflow Actions */}
                    {isEditing && currentUser?.role === 'ENGINEER' && formData.status === 'Draft' && (
                        <button
                            type="button"
                            onClick={() => handleStatusChange('Pending Review')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                            <span>Submit for Review</span>
                        </button>
                    )}

                    {canApprove && (
                        <>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Rejected')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Approved')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approve</span>
                            </button>
                        </>
                    )}

                    {isEditing && currentUser?.role === 'ENGINEER' && formData.status === 'Approved' && (
                        <button
                            type="button"
                            onClick={() => handleStatusChange('Implemented')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark as Implemented</span>
                        </button>
                    )}

                    {canEdit && (
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Draft</span>
                        </button>
                    )}

                    {canEdit && isEditing && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Title</label>
                    <input
                        type="text"
                        required
                        disabled={!canEdit && isEditing}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Priority</label>
                        <select
                            disabled={!canEdit && isEditing}
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as ECOPriority })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                            {formData.status}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        required
                        disabled={!canEdit && isEditing}
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Affected Products</label>
                    <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 max-h-60 overflow-y-auto">
                        {products.map(product => (
                            <div key={product.id} className="flex items-center p-3 hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    disabled={!canEdit && isEditing}
                                    checked={formData.productIds?.includes(product.id)}
                                    onChange={() => toggleProduct(product.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-slate-900">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.sku}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ECOEditor;
