import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconBuildingStore,
    IconDatabase,
    IconInfoCircle,
} from "@tabler/icons-react";

export default function Create() {
    // define useForm
    const { data, setData, post, processing, errors } = useForm({
        id: "",
        name: "",
        domain: "",
        db_host: "",
        db_port: "",
        db_database: "",
        db_username: "",
        db_password: "",
    });

    const [showDbConfig, setShowDbConfig] = useState(false);

    // auto slug generator for ID
    const handleNameChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            name: val,
            id: prev.id ? prev.id : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
            domain: prev.domain ? prev.domain : `${val.toLowerCase().replace(/[^a-z0-9]+/g, "")}.localhost`,
        }));
    };

    // submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("tenants.store"));
    };

    return (
        <>
            <Head title="Tambah Tenant" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <IconBuildingStore className="text-primary-500" size={28} />
                        Tambah Tenant Baru
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Buat dan konfigurasikan instance tenant POS baru
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
                    {/* Main Profil Tenant */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-850 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <IconBuildingStore size={20} className="text-primary-500" />
                                Informasi Bisnis & Toko
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                        Nama Bisnis/Toko <span className="text-danger-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 ${
                                            errors.name ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500" : "border-slate-200"
                                        }`}
                                        placeholder="Contoh: Toko Kopi Sejahtera"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-danger-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                            ID/Slug Tenant <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.id}
                                            onChange={(e) => setData("id", e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, ""))}
                                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 ${
                                                errors.id ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500" : "border-slate-200"
                                            }`}
                                            placeholder="toko-kopi-sejahtera"
                                        />
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Digunakan sebagai subdomain unik (hanya huruf, angka, dash).
                                        </p>
                                        {errors.id && (
                                            <p className="mt-1 text-xs text-danger-500">{errors.id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                            Domain Utama <span className="text-danger-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.domain}
                                            onChange={(e) => setData("domain", e.target.value.toLowerCase())}
                                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 ${
                                                errors.domain ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500" : "border-slate-200"
                                            }`}
                                            placeholder="kopisejahtera.localhost"
                                        />
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Domain / subdomain akses utama untuk tenant ini.
                                        </p>
                                        {errors.domain && (
                                            <p className="mt-1 text-xs text-danger-500">{errors.domain}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Database Custom Configuration Accordion */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => setShowDbConfig(!showDbConfig)}
                                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors"
                            >
                                <span className="text-base font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
                                    <IconDatabase size={20} className="text-primary-500" />
                                    Konfigurasi Database Kustom (Opsional)
                                </span>
                                <span className="text-xs font-semibold text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full">
                                    {showDbConfig ? "Sembunyikan" : "Tampilkan"}
                                </span>
                            </button>

                            {showDbConfig && (
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-2.5 p-3.5 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 rounded-lg text-sky-850 dark:text-sky-300 text-xs">
                                        <IconInfoCircle size={18} className="flex-shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">
                                            Secara default, sistem akan otomatis membuat database dengan format nama <code className="font-bold text-sky-900 dark:text-sky-400">pos_tenant_[id_tenant]</code> pada host landlord database. Isi bidang di bawah ini hanya jika Anda ingin mengarahkan tenant ke server database eksternal terpisah.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                                Database Host
                                            </label>
                                            <input
                                                type="text"
                                                value={data.db_host}
                                                onChange={(e) => setData("db_host", e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200"
                                                placeholder="127.0.0.1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                                Database Port
                                            </label>
                                            <input
                                                type="text"
                                                value={data.db_port}
                                                onChange={(e) => setData("db_port", e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200"
                                                placeholder="3306"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                                Nama Database
                                            </label>
                                            <input
                                                type="text"
                                                value={data.db_database}
                                                onChange={(e) => setData("db_database", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                                                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 ${
                                                    errors.db_database ? "border-danger-500" : "border-slate-200"
                                                }`}
                                                placeholder="db_kopi_sejahtera"
                                            />
                                            {errors.db_database && (
                                                <p className="mt-1 text-xs text-danger-500">{errors.db_database}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                                Database Username
                                            </label>
                                            <input
                                                type="text"
                                                value={data.db_username}
                                                onChange={(e) => setData("db_username", e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200"
                                                placeholder="root"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                                Database Password
                                            </label>
                                            <input
                                                type="password"
                                                value={data.db_password}
                                                onChange={(e) => setData("db_password", e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informasi Pendukung & Tombol Simpan */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-850 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                                Status Pembuatan
                            </h3>

                            <div className="space-y-3.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                <p>
                                    💡 <strong className="text-slate-700 dark:text-slate-300">Otomatisasi Penuh:</strong> Menekan tombol Simpan akan otomatis memicu:
                                </p>
                                <ul className="list-disc list-inside pl-1 space-y-1.5 font-medium">
                                    <li>Penciptaan database fisik</li>
                                    <li>Migrasi struktur schema POS</li>
                                    <li>Penyemaian (seeding) modul dasar</li>
                                    <li>Penyediaan default super-admin</li>
                                </ul>
                                <p className="text-[11px] bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded border border-slate-100 dark:border-slate-800 font-mono">
                                    Proses pembuatan dapat memakan waktu 5-15 detik. Mohon jangan menutup halaman ini saat sedang diproses.
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-bold rounded-lg transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                                >
                                    <IconDeviceFloppy size={18} />
                                    <span>{processing ? "Membuat Tenant..." : "Daftarkan Tenant"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
