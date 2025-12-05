import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

const SupplierList = () => {
    const { suppliers, deleteSupplier } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
                    <p className="text-slate-500 mt-1">Manage your supply chain partners</p>
                </div>
                <Link
                    to="/suppliers/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Supplier</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Supplier Name</th>
                                <th className="px-6 py-4">Contact Person</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredSuppliers.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Truck className="w-4 h-4" />
                                            </div>
                                            <div className="font-medium text-slate-900">{supplier.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{supplier.contactName}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail className="w-3 h-3 text-slate-400" />
                                                <span>{supplier.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone className="w-3 h-3 text-slate-400" />
                                                <span>{supplier.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            <span className="truncate max-w-xs">{supplier.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* View button removed as we don't have a supplier detail page yet, Edit serves both purposes for now */}
                                            <Link
                                                to={`/suppliers/${supplier.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this supplier?')) {
                                                        deleteSupplier(supplier.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSuppliers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No suppliers found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupplierList;
