import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import { IconDatabaseOff, IconKey, IconShield } from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Pagination from "@/Components/Dashboard/Pagination";

export default function Index() {
    const { permissions } = usePage().props;

    return (
        <>
            <Head title="Hak Akses" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconKey size={28} className="text-primary-500" />
                            Hak Akses
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {permissions.total || permissions.data?.length || 0} hak akses terdaftar
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4 w-full sm:w-80">
                <Search url={route("permissions.index")} placeholder="Cari hak akses..." />
            </div>

            {/* Permissions Grid */}
            {permissions.data.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {permissions.data.map((permission, i) => (
                        <div
                            key={permission.id || i}
                            className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50">
                                    <IconShield
                                        size={16}
                                        className="text-primary-600 dark:text-primary-400"
                                    />
                                </div>
                                <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {permission.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-slate-200">
                        Belum Ada Hak Akses
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Hak akses tidak ditemukan.
                    </p>
                </div>
            )}

            {permissions.last_page !== 1 && <Pagination links={permissions.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
