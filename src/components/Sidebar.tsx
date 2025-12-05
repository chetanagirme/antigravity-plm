import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, Users, LogOut, History, BarChart3, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { currentUser, logout } = useStore();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: Layers, label: 'BOMs', path: '/boms' },
        { icon: Users, label: 'Suppliers', path: '/suppliers' },
        { icon: History, label: 'Audit Logs', path: '/audit-logs', roles: ['DGM', 'ADMIN', 'MANAGER'] },
        { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['DGM', 'ADMIN', 'MANAGER'] },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Dyna PLM
                    </h1>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.filter(item => !item.roles || (currentUser && item.roles.includes(currentUser.role))).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()} // Close sidebar on mobile when link clicked
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50">
                        <img
                            src={currentUser?.avatar}
                            alt={currentUser?.name}
                            className="w-8 h-8 rounded-full bg-slate-700"
                        />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{currentUser?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
