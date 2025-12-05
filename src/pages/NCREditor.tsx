import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type NCR, type NCRSeverity, type NCRStatus } from '../types';

import { useToast } from '../context/ToastContext';

const NCREditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefillProductId = searchParams.get('productId') || '';

    const { ncrs, products, addNCR, updateNCR, currentUser } = useStore();
    const { success, error } = useToast();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<NCR>>({
        productId: prefillProductId,
        description: '',
        severity: 'Medium',
        status: 'Open',
    });

    useEffect(() => {
        if (isEditing && id) {
            const ncr = ncrs.find((n) => n.id === id);
            if (ncr) {
                setFormData(ncr);
            }
        } else {
            setFormData({
                productId: prefillProductId,
                description: '',
                severity: 'Medium',
                status: 'Open',
            });
        }
    }, [isEditing, id, ncrs, prefillProductId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();

        try {
            if (isEditing && id) {
                await updateNCR(id, { ...formData, updatedAt: now });
                success('NCR updated successfully');
            } else {
                if (!currentUser) {
                    error('You must be logged in to report an NCR');
                    return;
                }
                await addNCR({
                    ...formData,
                    id: crypto.randomUUID(),
                    reportedBy: currentUser.id,
                    createdAt: now,
                    updatedAt: now,
                } as NCR);
                success('NCR reported successfully');
            }
            navigate('/quality');
        } catch (err: any) {
            console.error('Error saving NCR:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save NCR';
            error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/quality" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEditing ? 'Edit NCR' : 'Report Non-Conformance'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/quality"
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm shadow-red-500/20"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Report</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Affected Product</label>
                    <select
                        required
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} ({p.sku})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Severity</label>
                        <select
                            value={formData.severity}
                            onChange={(e) => setFormData({ ...formData, severity: e.target.value as NCRSeverity })}
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
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as NCRStatus })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="Open">Open</option>
                            <option value="Investigating">Investigating</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Description of Issue</label>
                    <textarea
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Describe the non-conformance in detail..."
                    />
                </div>
            </div>
        </form>
    );
};

export default NCREditor;
