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
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                        <IconBuildingStore className="text-primary-500" size={28} />
                        Ubah Tenant: {tenant.name}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ubah profil utama, domain akses, dan status keaktifan tenant
                    </p>
                </div>
                <Link
                    href={route("tenants.index")}
                    className="text-slate-650 dark:hover:bg-slate-850 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-800"
                >
                    <IconArrowLeft size={16} />
                    <span>Kembali</span>
                </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Settings */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-slate-850 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold dark:border-slate-800 dark:text-slate-200">
                                <IconBuildingStore size={20} className="text-primary-500" />
                                Profil Tenant
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="dark:text-slate-350 mb-1.5 block text-sm font-semibold text-slate-700">
                                            ID/Slug Tenant
                                        </label>
                                        <input
                                            type="text"
                                            value={tenant.id}
                                            disabled
                                            className="border-slate-150 text-slate-450 w-full cursor-not-allowed rounded-lg border bg-slate-50 px-3.5 py-2.5 font-mono text-sm dark:border-slate-800 dark:bg-slate-950/40"
                                        />
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            ID unik tenant tidak dapat diubah setelah dibuat.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="dark:text-slate-350 mb-1.5 block text-sm font-semibold text-slate-700">
                                            Nama Bisnis/Toko{" "}
                                            <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 ${
                                                errors.name
                                                    ? "border-danger-500 focus:ring-danger-500/20"
                                                    : "border-slate-200"
                                            }`}
                                            placeholder="Contoh: Toko Kopi Sejahtera"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-danger-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="dark:text-slate-350 mb-1.5 block text-sm font-semibold text-slate-700">
                                            Domain Akses <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.domain}
                                            onChange={(e) =>
                                                setData("domain", e.target.value.toLowerCase())
                                            }
                                            className={`w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 ${
                                                errors.domain
                                                    ? "border-danger-500 focus:ring-danger-500/20"
                                                    : "border-slate-200"
                                            }`}
                                            placeholder="kopisejahtera.localhost"
                                        />
                                        {errors.domain && (
                                            <p className="mt-1 text-xs text-danger-500">
                                                {errors.domain}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="dark:text-slate-350 mb-1.5 block text-sm font-semibold text-slate-700">
                                            Status Keaktifan{" "}
                                            <span className="text-danger-500">*</span>
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData("status", e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        >
                                            <option value="active">Aktif (Active)</option>
                                            <option value="suspended">
                                                Ditangguhkan (Suspended)
                                            </option>
                                        </select>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Menangguhkan tenant akan memblokir akses login semua
                                            kasir & admin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Database Meta */}
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-slate-850 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold dark:border-slate-800 dark:text-slate-200">
                                <IconBuildingStore size={20} className="text-primary-500" />
                                Informasi Database & Storage
                            </h3>

                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div className="space-y-1">
                                    <span className="block font-semibold text-slate-500">
                                        Database Name
                                    </span>
                                    <span className="block w-fit rounded border border-slate-100 bg-slate-50 px-2 py-1 font-mono text-slate-800 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                                        {tenant.db_database}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block font-semibold text-slate-500">
                                        Storage Key
                                    </span>
                                    <span className="text-slate-855 dark:text-slate-305 block w-fit truncate rounded border border-slate-100 bg-slate-50 px-2 py-1 font-mono text-xs dark:border-slate-800 dark:bg-slate-950/40">
                                        {tenant.storage_key}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-slate-850 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold dark:border-slate-800 dark:text-slate-200">
                                <IconUserCheck size={18} className="text-primary-500" />
                                Aksi Simpan
                            </h3>

                            <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
                                Memperbarui profil tenant tidak mengubah credential database fisik,
                                sehingga aman dijalankan kapan saja.
                            </p>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-50"
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
