import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import { IconDatabaseOff, IconKey, IconShield } from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Pagination from "@/Components/Dashboard/Pagination";

// Parse permission name to user-friendly Module and Action
const parsePermission = (name) => {
    const parts = name.split("-");
    if (parts.length > 1) {
        const action = parts[parts.length - 1];
        const module = parts.slice(0, -1).join(" ");
        
        // Format module to Title Case
        const formattedModule = module.replace(/\b\w/g, (char) => char.toUpperCase());
        const formattedAction = action.toUpperCase();

        return {
            module: formattedModule,
            action: formattedAction,
            rawAction: action,
        };
    }
    
    return {
        module: name.replace(/\b\w/g, (char) => char.toUpperCase()),
        action: "ACCESS",
        rawAction: "access",
    };
};

// Get visual color styles for action badges
const getActionColor = (action) => {
    const act = action.toLowerCase();
    if (["index", "access", "show", "view"].includes(act)) {
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50";
    }
    if (["create", "store", "add"].includes(act)) {
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
    }
    if (["edit", "update", "upgrade"].includes(act)) {
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
    }
    if (["delete", "destroy", "remove", "void"].includes(act)) {
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
    }
    return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700";
};

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
            <div className="mb-6 w-full sm:w-80">
                <Search url={route("permissions.index")} placeholder="Cari hak akses..." />
            </div>

            {/* Permissions Grid */}
            {permissions.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {permissions.data.map((permission, i) => {
                        const parsed = parsePermission(permission.name);
                        return (
                            <div
                                key={permission.id || i}
                                className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Modul Akses
                                        </p>
                                        <h3 className="mt-1 truncate text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400" title={parsed.module}>
                                            {parsed.module}
                                        </h3>
                                    </div>
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-950/30 dark:text-primary-400">
                                        <IconShield size={18} />
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <span className="font-mono text-[11px] text-slate-450 dark:text-slate-500">
                                        {permission.name}
                                    </span>
                                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider border ${getActionColor(parsed.rawAction)}`}>
                                        {parsed.action}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
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

            {permissions.last_page !== 1 && (
                <div className="mt-6">
                    <Pagination links={permissions.links} />
                </div>
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
