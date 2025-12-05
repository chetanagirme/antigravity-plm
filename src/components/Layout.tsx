import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-slate-900">Dyna PLM</span>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Breadcrumbs />
                        <div className="mt-4">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
