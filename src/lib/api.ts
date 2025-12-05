import axios from 'axios';
import type { Product, BOM, Supplier, ECO, NCR, CAPA } from '../types';

const api = axios.create({
    baseURL: 'https://antigravity-plm.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    getAll: () => api.get<Product[]>('/products').then(res => res.data),
    getById: (id: string) => api.get<Product>(`/products/${id}`).then(res => res.data),
    create: (product: Product) => api.post<Product>('/products', product).then(res => res.data),
    update: (id: string, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product).then(res => res.data),
    delete: (id: string) => api.delete(`/products/${id}`).then(res => res.data),
};

export const bomService = {
    getAll: () => api.get<BOM[]>('/boms').then(res => res.data),
    create: (bom: BOM) => api.post<BOM>('/boms', bom).then(res => res.data),
    update: (id: string, bom: Partial<BOM>) => api.put<BOM>(`/boms/${id}`, bom).then(res => res.data),
    delete: (id: string) => api.delete(`/boms/${id}`).then(res => res.data),
};

export const supplierService = {
    getAll: () => api.get<Supplier[]>('/suppliers').then(res => res.data),
    create: (supplier: Supplier) => api.post<Supplier>('/suppliers', supplier).then(res => res.data),
    update: (id: string, supplier: Partial<Supplier>) => api.put<Supplier>(`/suppliers/${id}`, supplier).then(res => res.data),
    delete: (id: string) => api.delete(`/suppliers/${id}`).then(res => res.data),
};

export const ecoService = {
    getAll: () => api.get<ECO[]>('/ecos').then(res => res.data),
    create: (eco: ECO) => api.post<ECO>('/ecos', eco).then(res => res.data),
    update: (id: string, eco: Partial<ECO>) => api.put<ECO>(`/ecos/${id}`, eco).then(res => res.data),
    delete: (id: string) => api.delete(`/ecos/${id}`).then(res => res.data),
};

export const qualityService = {
    getNCRs: () => api.get<NCR[]>('/quality/ncrs').then(res => res.data),
    createNCR: (ncr: NCR) => api.post<NCR>('/quality/ncrs', ncr).then(res => res.data),
    updateNCR: (id: string, ncr: Partial<NCR>) => api.put<NCR>(`/quality/ncrs/${id}`, ncr).then(res => res.data),

    getCAPAs: () => api.get<CAPA[]>('/quality/capas').then(res => res.data),
    createCAPA: (capa: CAPA) => api.post<CAPA>('/quality/capas', capa).then(res => res.data),
};

export const auditService = {
    getAll: () => api.get('/audit').then(res => res.data),
    log: (entry: any) => api.post('/audit', entry).then(res => res.data),
};

export default api;
