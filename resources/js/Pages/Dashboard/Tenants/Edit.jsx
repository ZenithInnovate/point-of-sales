import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconBuildingStore,
    IconUserCheck,
} from "@tabler/icons-react";

export default function Edit({ tenant }) {
    // define useForm
    const { data, setData, post, processing, errors } = useForm({
        name: tenant.name || "",
        domain: tenant.domain || "",
        status: tenant.status || "active",
        _method: "PUT", // Spoof method for route resource
    });

    // submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("tenants.update", tenant.id));
    };

    return (
        <>
            <Head title="Ubah Tenant" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <IconBuildingStore className="text-primary-500" size={28} />
                        Ubah Tenant: {tenant.name}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ubah profil utama, domain akses, dan status keaktifan tenant
                    </p>
                </div>
                <Link
                    href={route("tenants.index")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    <span>Kembali</span>
                </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-850 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <IconBuildingStore size={20} className="text-primary-500" />
                                Profil Tenant
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                            ID/Slug Tenant
                                        </label>
                                        <input
                                            type="text"
                                            value={tenant.id}
                                            disabled
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-450 text-sm font-mono cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            ID unik tenant tidak dapat diubah setelah dibuat.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                            Nama Bisnis/Toko <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 ${
                                                errors.name ? "border-danger-500 focus:ring-danger-500/20" : "border-slate-200"
                                            }`}
                                            placeholder="Contoh: Toko Kopi Sejahtera"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-danger-500">{errors.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                            Domain Akses <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.domain}
                                            onChange={(e) => setData("domain", e.target.value.toLowerCase())}
                                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 ${
                                                errors.domain ? "border-danger-500 focus:ring-danger-500/20" : "border-slate-200"
                                            }`}
                                            placeholder="kopisejahtera.localhost"
                                        />
                                        {errors.domain && (
                                            <p className="mt-1 text-xs text-danger-500">{errors.domain}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                            Status Keaktifan <span className="text-danger-500">*</span>
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData("status", e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200"
                                        >
                                            <option value="active">Aktif (Active)</option>
                                            <option value="suspended">Ditangguhkan (Suspended)</option>
                                        </select>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Menangguhkan tenant akan memblokir akses login semua kasir & admin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Database Meta */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-850 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <IconBuildingStore size={20} className="text-primary-500" />
                                Informasi Database & Storage
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <span className="block font-semibold text-slate-500">Database Name</span>
                                    <span className="block font-mono text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded border border-slate-100 dark:border-slate-800 w-fit">
                                        {tenant.db_database}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block font-semibold text-slate-500">Storage Key</span>
                                    <span className="block font-mono text-slate-855 dark:text-slate-305 text-xs truncate bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded border border-slate-100 dark:border-slate-800 w-fit">
                                        {tenant.storage_key}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-850 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <IconUserCheck size={18} className="text-primary-500" />
                                Aksi Simpan
                            </h3>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                Memperbarui profil tenant tidak mengubah credential database fisik, sehingga aman dijalankan kapan saja.
                            </p>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-bold rounded-lg transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                            >
                                <IconDeviceFloppy size={18} />
                                <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
