import { create } from 'zustand';
import { type Product, type BOM, type Supplier, type User, type Role, type AuditLog, type ECO, type NCR, type CAPA, type Attachment } from '../types';
import { productService, bomService, supplierService, ecoService, qualityService, auditService } from '../lib/api';

interface AppState {
    isLoading: boolean;
    error: string | null;

    products: Product[];
    boms: BOM[];
    suppliers: Supplier[];

    // Async Actions
    fetchData: () => Promise<void>;

    addProduct: (product: Product) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    addBOM: (bom: BOM) => Promise<void>;
    updateBOM: (id: string, bom: Partial<BOM>) => Promise<void>;
    deleteBOM: (id: string) => Promise<void>;

    addSupplier: (supplier: Supplier) => Promise<void>;
    updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;

    // ECOs
    ecos: ECO[];
    addECO: (eco: ECO) => Promise<void>;
    updateECO: (id: string, eco: Partial<ECO>) => Promise<void>;
    deleteECO: (id: string) => Promise<void>;

    // Quality
    ncrs: NCR[];
    capas: CAPA[];
    addNCR: (ncr: NCR) => Promise<void>;
    updateNCR: (id: string, ncr: Partial<NCR>) => Promise<void>;
    addCAPA: (capa: CAPA) => Promise<void>;
    updateCAPA: (id: string, capa: Partial<CAPA>) => Promise<void>;

    // Attachments
    addAttachment: (productId: string, attachment: Attachment) => Promise<void>;
    deleteAttachment: (productId: string, attachmentId: string) => Promise<void>;

    currentUser: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: Role) => void;
    logout: () => void;

    // Audit
    auditLogs: AuditLog[];
    logAction: (action: string, details: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
    isLoading: false,
    error: null,
    products: [],
    boms: [],
    suppliers: [],
    ecos: [],
    ncrs: [],
    capas: [],
    auditLogs: [],
    currentUser: null,
    isAuthenticated: false,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const results = await Promise.allSettled([
                productService.getAll(),
                bomService.getAll(),
                supplierService.getAll(),
                ecoService.getAll(),
                qualityService.getNCRs(),
                qualityService.getCAPAs(),
                auditService.getAll(),
            ]);

            const [
                productsResult,
                bomsResult,
                suppliersResult,
                ecosResult,
                ncrsResult,
                capasResult,
                auditLogsResult
            ] = results;

            set({
                products: productsResult.status === 'fulfilled' ? productsResult.value : [],
                boms: bomsResult.status === 'fulfilled' ? bomsResult.value : [],
                suppliers: suppliersResult.status === 'fulfilled' ? suppliersResult.value : [],
                ecos: ecosResult.status === 'fulfilled' ? ecosResult.value : [],
                ncrs: ncrsResult.status === 'fulfilled' ? ncrsResult.value : [],
                capas: capasResult.status === 'fulfilled' ? capasResult.value : [],
                auditLogs: auditLogsResult.status === 'fulfilled' ? auditLogsResult.value : [],
                isLoading: false,
            });

            // Log errors for any failed requests
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to fetch data for index ${index}:`, result.reason);
                }
            });

        } catch (error: any) {
            console.error('Critical failure in fetchData:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    addProduct: async (product) => {
        try {
            const newProduct = await productService.create(product);
            set((state) => ({ products: [...state.products, newProduct] }));
            get().logAction('CREATE_PRODUCT', `Created product: ${product.name}`);
        } catch (error: any) {
            console.error('Failed to add product:', error);
            throw error;
        }
    },
    updateProduct: async (id, product) => {
        try {
            const updatedProduct = await productService.update(id, product);
            set((state) => ({
                products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            }));
            get().logAction('UPDATE_PRODUCT', `Updated product: ${id}`);
        } catch (error: any) {
            console.error('Failed to update product:', error);
            throw error;
        }
    },
    deleteProduct: async (id) => {
        try {
            await productService.delete(id);
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            }));
            get().logAction('DELETE_PRODUCT', `Deleted product: ${id}`);
        } catch (error: any) {
            console.error('Failed to delete product:', error);
            throw error;
        }
    },

    addBOM: async (bom) => {
        try {
            const newBOM = await bomService.create(bom);
            set((state) => ({ boms: [...state.boms, newBOM] }));
            get().logAction('CREATE_BOM', `Created BOM: ${bom.name}`);
        } catch (error: any) {
            console.error('Failed to add BOM:', error);
            throw error;
        }
    },
    updateBOM: async (id, bom) => {
        try {
            const updatedBOM = await bomService.update(id, bom);
            set((state) => ({
                boms: state.boms.map((b) => (b.id === id ? updatedBOM : b)),
            }));
            get().logAction('UPDATE_BOM', `Updated BOM: ${id}`);
        } catch (error: any) {
            console.error('Failed to update BOM:', error);
            throw error;
        }
    },
    deleteBOM: async (id) => {
        try {
            await bomService.delete(id);
            set((state) => ({
                boms: state.boms.filter((b) => b.id !== id),
            }));
            get().logAction('DELETE_BOM', `Deleted BOM: ${id}`);
        } catch (error: any) {
            console.error('Failed to delete BOM:', error);
            throw error;
        }
    },

    addSupplier: async (supplier) => {
        try {
            const newSupplier = await supplierService.create(supplier);
            set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
            get().logAction('CREATE_SUPPLIER', `Created Supplier: ${supplier.name}`);
        } catch (error: any) {
            console.error('Failed to add supplier:', error);
            throw error;
        }
    },
    updateSupplier: async (id, supplier) => {
        try {
            const updatedSupplier = await supplierService.update(id, supplier);
            set((state) => ({
                suppliers: state.suppliers.map((s) => (s.id === id ? updatedSupplier : s)),
            }));
            get().logAction('UPDATE_SUPPLIER', `Updated Supplier: ${id}`);
        } catch (error: any) {
            console.error('Failed to update supplier:', error);
            throw error;
        }
    },
    deleteSupplier: async (id) => {
        try {
            await supplierService.delete(id);
            set((state) => ({
                suppliers: state.suppliers.filter((s) => s.id !== id),
            }));
            get().logAction('DELETE_SUPPLIER', `Deleted Supplier: ${id}`);
        } catch (error: any) {
            console.error('Failed to delete supplier:', error);
            throw error;
        }
    },

    addECO: async (eco) => {
        try {
            const newECO = await ecoService.create(eco);
            set((state) => ({ ecos: [...state.ecos, newECO] }));
            get().logAction('CREATE_ECO', `Created ECO: ${eco.title}`);
        } catch (error: any) {
            console.error('Failed to add ECO:', error);
            throw error;
        }
    },
    updateECO: async (id, eco) => {
        try {
            const updatedECO = await ecoService.update(id, eco);
            set((state) => ({
                ecos: state.ecos.map((e) => (e.id === id ? updatedECO : e)),
            }));
            get().logAction('UPDATE_ECO', `Updated ECO: ${id}`);
        } catch (error: any) {
            console.error('Failed to update ECO:', error);
            throw error;
        }
    },
    deleteECO: async (id) => {
        try {
            await ecoService.delete(id);
            set((state) => ({
                ecos: state.ecos.filter((e) => e.id !== id),
            }));
            get().logAction('DELETE_ECO', `Deleted ECO: ${id}`);
        } catch (error: any) {
            console.error('Failed to delete ECO:', error);
            throw error;
        }
    },

    addNCR: async (ncr) => {
        try {
            const newNCR = await qualityService.createNCR(ncr);
            set((state) => ({ ncrs: [...state.ncrs, newNCR] }));
            get().logAction('CREATE_NCR', `Reported NCR: ${ncr.id}`);
        } catch (error: any) {
            console.error('Failed to add NCR:', error);
            throw error;
        }
    },
    updateNCR: async (id, ncr) => {
        try {
            const updatedNCR = await qualityService.updateNCR(id, ncr);
            set((state) => ({
                ncrs: state.ncrs.map((n) => (n.id === id ? updatedNCR : n)),
            }));
            get().logAction('UPDATE_NCR', `Updated NCR: ${id}`);
        } catch (error: any) {
            console.error('Failed to update NCR:', error);
            throw error;
        }
    },
    addCAPA: async (capa) => {
        try {
            const newCAPA = await qualityService.createCAPA(capa);
            set((state) => ({ capas: [...state.capas, newCAPA] }));
            get().logAction('CREATE_CAPA', `Created CAPA: ${capa.title}`);
        } catch (error: any) {
            console.error('Failed to add CAPA:', error);
            throw error;
        }
    },
    updateCAPA: async (id, capa) => {
        // Implement update CAPA API if needed
        set((state) => ({
            capas: state.capas.map((c) => (c.id === id ? { ...c, ...capa } : c)),
        }));
    },

    // Attachments
    addAttachment: async (productId, attachment) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const newAttachments = [...(product.attachments || []), attachment];

        try {
            await productService.update(productId, { attachments: newAttachments });
            set((state) => ({
                products: state.products.map(p => p.id === productId ? { ...p, attachments: newAttachments } : p),
            }));
            get().logAction('ADD_ATTACHMENT', `Added attachment to ${product.name}: ${attachment.name}`);
        } catch (error) {
            console.error('Failed to add attachment:', error);
        }
    },
    deleteAttachment: async (productId, attachmentId) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const newAttachments = product.attachments?.filter(a => a.id !== attachmentId) || [];

        try {
            await productService.update(productId, { attachments: newAttachments });
            set((state) => ({
                products: state.products.map(p => p.id === productId ? { ...p, attachments: newAttachments } : p),
            }));
            get().logAction('DELETE_ATTACHMENT', `Deleted attachment from ${product.name}`);
        } catch (error) {
            console.error('Failed to delete attachment:', error);
        }
    },

    login: (email, role) => set({
        isAuthenticated: true,
        currentUser: {
            id: 'u1', // Mock ID
            name: email.split('@')[0],
            email,
            role,
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
        }
    }),
    logout: () => set({ isAuthenticated: false, currentUser: null }),

    logAction: async (action, details) => {
        const state = get();
        if (!state.currentUser) return;

        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            userId: state.currentUser.id,
            userName: state.currentUser.name,
            action,
            details,
            timestamp: new Date().toISOString(),
        };

        try {
            await auditService.log(newLog);
            set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
        } catch (error) {
            console.error('Failed to save audit log:', error);
        }
    },
}));
