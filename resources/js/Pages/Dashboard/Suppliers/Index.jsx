import React, { useEffect, useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { IconBuildingStore, IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuthorization } from "@/Utils/authorization";

export default function SuppliersIndex({ suppliers = [] }) {
    const { flash } = usePage().props;
    const { can } = useAuthorization();
    const [editing, setEditing] = useState(null);
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
    };

    const cancel = () => {
        setEditing(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route("suppliers.update", editing), {
                onSuccess: () => cancel(),
            });
        } else {
            post(route("suppliers.store"), {
                onSuccess: () => reset(),
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
                            onClick={cancel}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-white"
                        >
                            <IconPlus size={16} />
                            Tambah Supplier
                        </button>
                    )}
                </div>

                {canManageSuppliers && (
                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4"
                    >
                        <div className="md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Nama
                            </label>
                            <input
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Telepon
                            </label>
                            <input
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Email
                            </label>
                            <input
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                type="email"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Alamat
                            </label>
                            <textarea
                                rows={1}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 md:col-span-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                                {editing ? "Update" : "Simpan"}
                            </button>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={cancel}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
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
        </>
    );
}

SuppliersIndex.layout = (page) => <DashboardLayout children={page} />;
