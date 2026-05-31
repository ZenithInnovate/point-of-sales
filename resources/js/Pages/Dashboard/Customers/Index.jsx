import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconLayoutGrid,
    IconList,
    IconUser,
    IconPhone,
    IconMapPin,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import { useAuthorization } from "@/Utils/authorization";

// Helpers for Premium Aesthetics
const getTierGradient = (customer) => {
    if (!customer.is_loyalty_member) return "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700";
    const tier = customer.loyalty_tier?.toLowerCase();
    if (tier === "platinum") return "from-purple-500 via-indigo-500 to-pink-500";
    if (tier === "gold") return "from-amber-400 via-orange-500 to-yellow-500";
    if (tier === "silver") return "from-slate-300 via-slate-400 to-zinc-400";
    return "from-primary-400 to-primary-600";
};

const getAvatarGradient = (customer) => {
    if (!customer.is_loyalty_member) return "from-sky-400 to-primary-600";
    const tier = customer.loyalty_tier?.toLowerCase();
    if (tier === "platinum") return "from-purple-500 to-indigo-600";
    if (tier === "gold") return "from-amber-400 to-orange-500";
    if (tier === "silver") return "from-slate-400 to-zinc-500";
    return "from-primary-400 to-primary-600";
};

const getTierBadgeClass = (customer) => {
    if (!customer.is_loyalty_member) {
        return "bg-slate-50 text-slate-500 border border-slate-200/60 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-800";
    }
    const tier = customer.loyalty_tier?.toLowerCase();
    if (tier === "platinum") {
        return "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50";
    }
    if (tier === "gold") {
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
    }
    if (tier === "silver") {
        return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/50";
    }
    return "bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/50";
};

// Customer Card for Grid View
function CustomerCard({ customer, canUpdate, canDelete }) {
    return (
        <div className="relative overflow-hidden group bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            {/* Top Tier Line Indicator */}
            <div className={`absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r ${getTierGradient(customer)}`} />

            {/* Avatar & Name */}
            <div className="flex items-start justify-between mb-5 mt-1">
                <div className="flex items-center gap-4">
                    {customer.avatar ? (
                        <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-850 group-hover:ring-primary-100 dark:group-hover:ring-primary-950/30 transition-all duration-300"
                        />
                    ) : (
                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-tr ${getAvatarGradient(customer)} flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md ring-4 ring-slate-50 dark:ring-slate-850 group-hover:ring-primary-100 dark:group-hover:ring-primary-950/30 transition-all duration-300`}>
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <Link
                                href={route("customers.show", customer.id)}
                            >
                                {customer.name}
                            </Link>
                        </h3>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTierBadgeClass(customer)}`}>
                                {customer.is_loyalty_member
                                    ? customer.loyalty_tier
                                    : "non-member"}
                            </span>
                            <span className="inline-flex rounded-lg bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                {customer.loyalty_points || 0} poin
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6 bg-slate-50/50 dark:bg-slate-950/30 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                {customer.no_telp && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-350">
                        <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex-shrink-0">
                            <IconPhone size={14} />
                        </div>
                        <span className="font-medium">{customer.no_telp}</span>
                    </div>
                )}
                {customer.address && (
                    <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-350">
                        <div className="p-1.5 rounded-lg bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5">
                            <IconMapPin size={14} />
                        </div>
                        <span className="line-clamp-2 leading-relaxed font-medium">{customer.address}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            {(canUpdate || canDelete) && (
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                    {canUpdate && (
                        <Link
                            href={route("customers.edit", customer.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-[0.98] dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30 text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-amber-200/40 dark:border-amber-900/30"
                        >
                            <IconPencilCog size={15} />
                            <span>Edit</span>
                        </Link>
                    )}
                    {canDelete && (
                        <Button
                            type={"delete"}
                            icon={<IconTrash size={15} />}
                            className={
                                "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 active:scale-[0.98] dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30 text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-rose-200/40 dark:border-rose-900/30"
                            }
                            url={route("customers.destroy", customer.id)}
                            label="Hapus"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default function Index({ customers }) {
    const { can } = useAuthorization();
    const [viewMode, setViewMode] = useState("grid");
    const canCreateCustomers = can("customers-create");
    const canEditCustomers = can("customers-edit");
    const canDeleteCustomers = can("customers-delete");

    return (
        <>
            <Head title="Pelanggan" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Pelanggan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {customers.total || customers.data?.length || 0}{" "}
                            pelanggan terdaftar
                        </p>
                    </div>
                    {canCreateCustomers && (
                        <Button
                            type={"link"}
                            icon={
                                <IconCirclePlus
                                    size={18}
                                    strokeWidth={1.5}
                                />
                            }
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                            }
                            label={"Tambah Pelanggan"}
                            href={route("customers.create")}
                        />
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("customers.index")}
                        placeholder="Cari pelanggan..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "grid"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Grid View"
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "list"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="List View"
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {customers.data.length > 0 ? (
                viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {customers.data.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                canUpdate={canEditCustomers}
                                canDelete={canDeleteCustomers}
                            />
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <Table.Card title={"Data Pelanggan"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Pelanggan</Table.Th>
                                    <Table.Th>Loyalty</Table.Th>
                                    <Table.Th>No. Telepon</Table.Th>
                                    <Table.Th>Alamat</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {customers.data.map((customer, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={customer.id}
                                    >
                                        <Table.Td className="text-center">
                                            {++i +
                                                (customers.current_page - 1) *
                                                    customers.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                {customer.avatar ? (
                                                    <img
                                                        src={customer.avatar}
                                                        alt={customer.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                                        {customer.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    <Link
                                                        href={route(
                                                            "customers.show",
                                                            customer.id
                                                        )}
                                                        className="hover:text-primary-600"
                                                    >
                                                        {customer.name}
                                                    </Link>
                                                </p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-300">
                                                    {customer.is_loyalty_member
                                                        ? customer.loyalty_tier
                                                        : "non-member"}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {customer.loyalty_points ||
                                                        0}{" "}
                                                    poin
                                                </span>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {customer.no_telp || "-"}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                                {customer.address || "-"}
                                            </p>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
                                                {canEditCustomers && (
                                                    <Button
                                                        type={"edit"}
                                                        icon={
                                                            <IconPencilCog
                                                                size={16}
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                        }
                                                        className={
                                                            "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                        }
                                                        href={route(
                                                            "customers.edit",
                                                            customer.id
                                                        )}
                                                    />
                                                )}
                                                {canDeleteCustomers && (
                                                    <Button
                                                        type={"delete"}
                                                        icon={
                                                            <IconTrash
                                                                size={16}
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                        }
                                                        className={
                                                            "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                        }
                                                        url={route(
                                                            "customers.destroy",
                                                            customer.id
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                )
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Pelanggan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan pelanggan pertama Anda.
                    </p>
                    <Button
                        type={"link"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white"
                        }
                        label={"Tambah Pelanggan"}
                        href={route("customers.create")}
                    />
                </div>
            )}

            {customers.last_page !== 1 && (
                <Pagination links={customers.links} />
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
