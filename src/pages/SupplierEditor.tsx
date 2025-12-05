import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type Supplier } from '../types';

import { useToast } from '../context/ToastContext';

const SupplierEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { suppliers, addSupplier, updateSupplier } = useStore();
    const { success, error } = useToast();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<Supplier>>({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (isEditing && id) {
            const supplier = suppliers.find((s) => s.id === id);
            if (supplier) {
                setFormData(supplier);
            }
        } else {
            setFormData({
                name: '',
                contactName: '',
                email: '',
                phone: '',
                address: '',
            });
        }
    }, [isEditing, id, suppliers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && id) {
                await updateSupplier(id, formData);
                success('Supplier updated successfully');
            } else {
                await addSupplier({
                    ...formData,
                    id: crypto.randomUUID(),
                } as Supplier);
                success('Supplier created successfully');
            }
            navigate('/suppliers');
        } catch (err: any) {
            console.error('Error saving supplier:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save supplier';
            error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/suppliers" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEditing ? 'Edit Supplier' : 'New Supplier'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/suppliers"
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Supplier</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Company Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Contact Person</label>
                        <input
                            type="text"
                            required
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Phone</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Address</label>
                    <textarea
                        rows={3}
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>
        </form>
    );
};

export default SupplierEditor;
