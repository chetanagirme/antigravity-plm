import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const BOMList = () => {
    const { boms, products, deleteBOM } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Helper to get product name
    const getProductName = (productId: string) => {
        return products.find(p => p.id === productId)?.name || 'Unknown Product';
    };

    const filteredBOMs = boms.filter(bom =>
        bom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProductName(bom.productId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bill of Materials</h1>
                    <p className="text-slate-500 mt-1">Manage product structures and components</p>
                </div>
                <Link
                    to="/boms/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create BOM</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search BOMs..."
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
                                <th className="px-6 py-4">BOM Name</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Version</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Components</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredBOMs.map((bom) => (
                                <tr key={bom.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div className="font-medium text-slate-900">{bom.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{getProductName(bom.productId)}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">v{bom.version}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            bom.status === 'Approved' && "bg-green-50 text-green-700 border-green-200",
                                            bom.status === 'Draft' && "bg-amber-50 text-amber-700 border-amber-200",
                                            bom.status === 'Obsolete' && "bg-slate-50 text-slate-700 border-slate-200",
                                        )}>
                                            {bom.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                        {bom.components.length}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/boms/${bom.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this BOM?')) {
                                                        deleteBOM(bom.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBOMs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No BOMs found. Create one to get started.
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

export default BOMList;
