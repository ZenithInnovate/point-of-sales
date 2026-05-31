import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import {
    IconBuildingStore,
    IconUsers,
    IconDatabase,
    IconActivity,
    IconArrowUpRight,
    IconFolder,
    IconMail,
    IconCreditCard,
} from "@tabler/icons-react";

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
    return (
        <div
            className={`
            relative overflow-hidden rounded-lg p-5
            bg-gradient-to-br ${gradient}
            text-white shadow-lg border-b-4 border-black/10
        `}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-28 h-28 opacity-15">
                <Icon
                    size={112}
                    strokeWidth={0.5}
                    className="transform translate-x-6 -translate-y-6"
                />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-white/20">
                        <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium opacity-90">
                        {title}
                    </span>
                </div>

                <p className="text-3xl font-bold font-mono leading-tight">{value}</p>
                <p className="mt-2 text-xs opacity-75">{subtitle}</p>
            </div>
        </div>
    );
}

// Widget List Container Component
function WidgetList({ title, subtitle, icon: Icon, children, emptyMessage }) {
    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-500">
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-5">
                {children || (
                    <div className="flex h-32 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MasterIndex({ stats, recentTenants = [], recentAuditLogs = [] }) {
    return (
        <>
            <Head title="Pusat Kontrol SaaS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconBuildingStore size={28} className="text-primary-500" />
                            Pusat Kontrol SaaS
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Dasbor pemantauan database landlord & keaktifan tenant retail
                        </p>
                    </div>
                    <Link
                        href={route("tenants.create")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
                    >
                        <IconBuildingStore size={18} />
                        <span>Daftarkan Tenant Baru</span>
                    </Link>
                </div>

                {/* SaaS Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Tenant POS"
                        value={stats.total_tenants}
                        subtitle="Jumlah seluruh instansi retail terdaftar"
                        icon={IconBuildingStore}
                        gradient="from-primary-500 to-primary-700"
                    />
                    <StatCard
                        title="Tenant Aktif"
                        value={stats.active_tenants}
                        subtitle="Retail dengan akses domain aktif"
                        icon={IconBuildingStore}
                        gradient="from-success-500 to-success-700"
                    />
                    <StatCard
                        title="Tenant Ditangguhkan"
                        value={stats.suspended_tenants}
                        subtitle="Tenant suspended karena tagihan / regulasi"
                        icon={IconBuildingStore}
                        gradient="from-rose-500 to-rose-700"
                    />
                    <StatCard
                        title="Landlord Admins"
                        value={stats.total_users}
                        subtitle="Pengguna pengelola sistem pusat"
                        icon={IconUsers}
                        gradient="from-amber-500 to-amber-700"
                    />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Tenant Registrations */}
                    <WidgetList
                        title="Registrasi Tenant Terbaru"
                        subtitle="5 tenant retail yang baru mendaftar"
                        icon={IconBuildingStore}
                        emptyMessage="Belum ada tenant retail terdaftar"
                    >
                        {recentTenants.length > 0 && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentTenants.map((t) => (
                                    <div
                                        key={t.id}
                                        className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-center justify-center font-bold text-slate-700 dark:text-slate-350">
                                                {t.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                    {t.name}
                                                </p>
                                                <a
                                                    href={`http://${t.domain}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-500 hover:underline flex items-center gap-0.5"
                                                >
                                                    {t.domain}
                                                    <IconArrowUpRight size={10} />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    t.status === "active"
                                                        ? "bg-success-50 text-success-700 border border-success-100 dark:bg-success-950/20 dark:text-success-400 dark:border-success-900/50"
                                                        : "bg-danger-50 text-danger-700 border border-danger-100 dark:bg-danger-950/20 dark:text-danger-400 dark:border-danger-900/50"
                                                }`}
                                            >
                                                {t.status}
                                            </span>
                                            <span className="text-[10px] text-slate-450 dark:text-slate-500">
                                                {t.created_at}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </WidgetList>

                    {/* Landlord Operation Log */}
                    <WidgetList
                        title="Log Aktivitas Sistem Pusat"
                        subtitle="Histori audit log pembuatan & kontrol tenant"
                        icon={IconActivity}
                        emptyMessage="Belum ada audit log terekam"
                    >
                        {recentAuditLogs.length > 0 && (
                            <div className="space-y-4">
                                {recentAuditLogs.map((log, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/40"
                                    >
                                        <div className="p-1.5 rounded bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 mt-0.5">
                                            <IconActivity size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                {log.description}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-450 dark:text-slate-500 font-medium">
                                                <span className="text-slate-600 dark:text-slate-350">{log.username}</span>
                                                <span>•</span>
                                                <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.2 rounded border border-slate-200/50 dark:border-slate-800">
                                                    {log.module}
                                                </span>
                                                <span>•</span>
                                                <span>{log.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </WidgetList>
                </div>
            </div>
        </>
    );
}

MasterIndex.layout = (page) => <DashboardLayout children={page} />;
