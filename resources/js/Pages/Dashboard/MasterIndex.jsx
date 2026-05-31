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
            className={`relative overflow-hidden rounded-lg bg-gradient-to-br p-5 ${gradient} border-b-4 border-black/10 text-white shadow-lg`}
        >
            {/* Background Pattern */}
            <div className="absolute right-0 top-0 h-28 w-28 opacity-15">
                <Icon
                    size={112}
                    strokeWidth={0.5}
                    className="-translate-y-6 translate-x-6 transform"
                />
            </div>

            <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-white/20 p-2">
                        <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium opacity-90">{title}</span>
                </div>

                <p className="font-mono text-3xl font-bold leading-tight">{value}</p>
                <p className="mt-2 text-xs opacity-75">{subtitle}</p>
            </div>
        </div>
    );
}

// Widget List Container Component
function WidgetList({ title, subtitle, icon: Icon, children, emptyMessage }) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary-50 p-2 text-primary-500 dark:bg-primary-950/40">
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconBuildingStore size={28} className="text-primary-500" />
                            Pusat Kontrol SaaS
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Dasbor pemantauan database landlord & keaktifan tenant retail
                        </p>
                    </div>
                    <Link
                        href={route("tenants.create")}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 active:scale-[0.98]"
                    >
                        <IconBuildingStore size={18} />
                        <span>Daftarkan Tenant Baru</span>
                    </Link>
                </div>

                {/* SaaS Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                                        className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="dark:border-slate-850 dark:text-slate-350 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 font-bold text-slate-700 dark:bg-slate-950">
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
                                                    className="flex items-center gap-0.5 text-xs text-primary-500 hover:underline"
                                                >
                                                    {t.domain}
                                                    <IconArrowUpRight size={10} />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 text-right">
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    t.status === "active"
                                                        ? "border border-success-100 bg-success-50 text-success-700 dark:border-success-900/50 dark:bg-success-950/20 dark:text-success-400"
                                                        : "border border-danger-100 bg-danger-50 text-danger-700 dark:border-danger-900/50 dark:bg-danger-950/20 dark:text-danger-400"
                                                }`}
                                            >
                                                {t.status}
                                            </span>
                                            <span className="text-slate-450 text-[10px] dark:text-slate-500">
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
                                        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800/40 dark:bg-slate-800/40"
                                    >
                                        <div className="mt-0.5 rounded bg-primary-100 p-1.5 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                                            <IconActivity size={14} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                {log.description}
                                            </p>
                                            <div className="text-slate-450 mt-1 flex items-center gap-1.5 text-[10px] font-medium dark:text-slate-500">
                                                <span className="dark:text-slate-350 text-slate-600">
                                                    {log.username}
                                                </span>
                                                <span>•</span>
                                                <span className="py-0.2 rounded border border-slate-200/50 bg-slate-100 px-1 font-mono dark:border-slate-800 dark:bg-slate-900">
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
