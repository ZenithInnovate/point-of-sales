import React, { useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { IconBuildingStore, IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuthorization } from "@/Utils/authorization";
import Modal from "@/Components/Dashboard/Modal";

export default function SuppliersIndex({ suppliers = [] }) {
    const { flash } = usePage().props;
    const { can } = useAuthorization();
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const canManageSuppliers = can("suppliers-access");

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const startEdit = (supplier) => {
        setEditing(supplier.id);
        setData({
            name: supplier.name || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
        });
        setShowModal(true);
    };

    const handleOpenCreateModal = () => {
        setEditing(null);
        reset();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditing(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route("suppliers.update", editing), {
                onSuccess: () => handleCloseModal(),
            });
        } else {
            post(route("suppliers.store"), {
                onSuccess: () => handleCloseModal(),
            });
        }
    };

    const remove = (id) => {
        if (!confirm("Hapus supplier ini?")) return;
        destroy(route("suppliers.destroy", id));
    };

    return (
        <>
            <Head title="Supplier" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconBuildingStore size={26} className="text-primary-500" />
                            Supplier
                        </h1>
                        <p className="text-sm text-slate-500">
                            Data pemasok untuk pencatatan hutang.
                        </p>
                    </div>
                    {canManageSuppliers && (
                        <button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 active:scale-[0.98]"
                        >
                            <IconPlus size={16} />
                            Tambah Supplier
                        </button>
                    )}
                </div>

                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {suppliers.length ? (
                        suppliers.map((sup) => (
                            <div key={sup.id} className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                        {sup.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {sup.phone || "-"} • {sup.email || "-"}
                                    </p>
                                    {sup.address && (
                                        <p className="text-xs text-slate-500">{sup.address}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {canManageSuppliers && (
                                        <>
                                            <button
                                                onClick={() => startEdit(sup)}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            >
                                                <IconPencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => remove(sup.id)}
                                                className="rounded-lg p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30"
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-slate-500">Belum ada supplier.</div>
                    )}
                </div>
            </div>

            {/* Modal Tambah / Edit Supplier */}
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                title={editing ? "Edit Supplier" : "Tambah Supplier"}
                maxWidth="lg"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Nama Supplier <span className="text-danger-500">*</span>
                        </label>
                        <input
                            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Masukkan nama supplier..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Telepon
                            </label>
                            <input
                                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                placeholder="Contoh: 08123456789"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Email
                            </label>
                            <input
                                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                type="email"
                                placeholder="Contoh: supplier@toko.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Alamat
                        </label>
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            placeholder="Masukkan alamat lengkap..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                        >
                            {editing ? "Simpan Perubahan" : "Simpan Supplier"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

SuppliersIndex.layout = (page) => <DashboardLayout children={page} />;
