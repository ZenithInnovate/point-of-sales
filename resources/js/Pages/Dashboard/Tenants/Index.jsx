import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconBuildingStore,
    IconLink,
    IconDatabase,
    IconCalendar,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import { useAuthorization } from "@/Utils/authorization";

// Helper for Status Badge
const getStatusBadge = (status) => {
    if (status === "active") {
        return "bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400 border border-success-200 dark:border-success-800";
    }
    return "bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400 border border-danger-200 dark:border-danger-800";
};

export default function Index({ tenants }) {
    const { can } = useAuthorization();
    const canCreateTenants = can("tenants-create");
    const canEditTenants = can("tenants-update");
    const canDeleteTenants = can("tenants-delete");

    return (
        <>
            <Head title="Kelola Tenant" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconBuildingStore size={28} className="text-primary-500" />
                            Kelola Tenant
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {tenants.total || tenants.data?.length || 0} tenant terdaftar di
                            database landlord
                        </p>
                    </div>
                    {canCreateTenants && (
                        <Button
                            type={"link"}
                            icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                            className="bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600"
                            label={"Tambah Tenant"}
                            href={route("tenants.create")}
                        />
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("tenants.index")}
                        placeholder="Cari nama, ID, atau domain..."
                    />
                </div>
            </div>

            {/* Content Table */}
            {tenants.data.length > 0 ? (
                <Table.Card title={"Daftar Tenant POS"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Tenant</Table.Th>
                                <Table.Th>Domain</Table.Th>
                                <Table.Th>Database</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Terdaftar</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tenants.data.map((tenant, i) => (
                                <tr
                                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    key={tenant.id}
                                >
                                    <Table.Td className="text-center font-medium text-slate-500">
                                        {++i + (tenants.current_page - 1) * tenants.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-lg font-bold text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                                                {tenant.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                    {tenant.name}
                                                </p>
                                                <p className="font-mono text-xs text-slate-400">
                                                    ID: {tenant.id}
                                                </p>
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="dark:text-slate-350 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                            <IconLink size={14} className="text-slate-400" />
                                            <a
                                                href={`http://${tenant.domain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="transition-colors hover:text-primary-600 hover:underline"
                                            >
                                                {tenant.domain}
                                            </a>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="dark:text-slate-350 flex items-center gap-1.5 font-mono text-sm text-slate-600">
                                            <IconDatabase size={14} className="text-slate-400" />
                                            <span>{tenant.db_database}</span>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <span
                                            className={`rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${getStatusBadge(tenant.status)}`}
                                        >
                                            {tenant.status}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <IconCalendar size={14} />
                                            <span>
                                                {new Date(tenant.created_at).toLocaleDateString(
                                                    "id-ID",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex gap-2">
                                            {canEditTenants && (
                                                <Button
                                                    type={"edit"}
                                                    icon={
                                                        <IconPencilCog
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className="rounded-lg border border-warning-200 bg-warning-100 text-warning-600 hover:bg-warning-200 dark:border-warning-800 dark:bg-warning-900/50 dark:text-warning-400"
                                                    href={route("tenants.edit", tenant.id)}
                                                />
                                            )}
                                            {canDeleteTenants && (
                                                <Button
                                                    type={"delete"}
                                                    icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                    className="rounded-lg border border-danger-200 bg-danger-100 text-danger-600 hover:bg-danger-200 dark:border-danger-800 dark:bg-danger-900/50 dark:text-danger-400"
                                                    url={route("tenants.destroy", tenant.id)}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-slate-200">
                        Belum Ada Tenant Terdaftar
                    </h3>
                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                        Daftarkan tenant POS pertama Anda untuk memulai multi-tenant SaaS.
                    </p>
                    {canCreateTenants && (
                        <Button
                            type={"link"}
                            icon={<IconCirclePlus size={18} />}
                            className="bg-primary-500 text-white hover:bg-primary-600"
                            label="Tambah Tenant"
                            href={route("tenants.create")}
                        />
                    )}
                </div>
            )}

            {tenants.last_page !== 1 && <Pagination links={tenants.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
