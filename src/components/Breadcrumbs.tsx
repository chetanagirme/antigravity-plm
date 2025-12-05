import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex items-center text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

                return (
                    <div key={to} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                        {isLast ? (
                            <span className="font-medium text-slate-900">{label}</span>
                        ) : (
                            <Link to={to} className="hover:text-slate-900 transition-colors">
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
