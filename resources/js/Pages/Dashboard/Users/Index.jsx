import DashboardLayout from "@/Layouts/DashboardLayout";
import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconTrash,
    IconPencilCog,
    IconUser,
    IconShield,
    IconMail,
    IconLayoutGrid,
    IconList,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Checkbox from "@/Components/Dashboard/Checkbox";
import Pagination from "@/Components/Dashboard/Pagination";
import { useAuthorization } from "@/Utils/authorization";
import Swal from "sweetalert2";

// User Card for Grid View
function UserCard({ user, isSelected, onSelect, onDelete, canUpdate, canDelete }) {
    const avatarUrl = user.avatar;
    const initial =
        user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "?";

    return (
        <div
            className={`group flex h-full flex-col rounded-lg border bg-white transition-all duration-200 hover:shadow-lg dark:bg-slate-900 ${
                isSelected
                    ? "border-primary-500 ring-2 ring-primary-500/20 dark:border-primary-600"
                    : "border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700"
            }`}
        >
            {/* Header: Checkbox + Avatar + Info */}
            <div className="relative p-5 pb-3">
                {/* Checkbox top-right */}
                {canDelete && (
                    <div className="absolute right-4 top-4">
                        <Checkbox value={user.id} onChange={onSelect} checked={isSelected} />
                    </div>
                )}

                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xl font-bold text-white shadow-md ring-4 ring-primary-100 dark:ring-primary-900/30">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            initial
                        )}
                    </div>

                    {/* Name & Email */}
                    <h3 className="mt-3 w-full truncate text-center text-base font-semibold text-slate-800 dark:text-slate-200">
                        {user.name}
                    </h3>
                    <p className="mt-0.5 flex max-w-full items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        <IconMail size={12} className="shrink-0" />
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Roles */}
            <div className="flex-1 px-4 pb-4">
                <div className="flex flex-wrap justify-center gap-1.5">
                    {user.roles.map((role, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 rounded-lg bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-400"
                        >
                            <IconShield size={12} />
                            {role.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Actions - always pinned to bottom */}
            {(canUpdate || canDelete) && (
                <div className="mt-auto flex border-t border-slate-100 dark:border-slate-800">
                    {canUpdate && (
                        <Link
                            href={route("users.edit", user.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-warning-600 transition-colors hover:bg-warning-50 dark:hover:bg-warning-950/50"
                        >
                            <IconPencilCog size={16} />
                            <span>Edit</span>
                        </Link>
                    )}
                    {canUpdate && canDelete && (
                        <div className="w-px bg-slate-100 dark:bg-slate-800" />
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(user.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 dark:hover:bg-danger-950/50"
                        >
                            <IconTrash size={16} />
                            <span>Hapus</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Index() {
    const { users } = usePage().props;
    const { can } = useAuthorization();
    const [viewMode, setViewMode] = useState("grid");
    const canCreateUsers = can("users-create");
    const canUpdateUsers = can("users-update");
    const canDeleteUsers = can("users-delete");

    const {
        data,
        setData,
        delete: destroy,
        reset,
    } = useForm({
        selectedUser: [],
    });

    const setSelectedUser = (e) => {
        let items = data.selectedUser;
        if (items.some((id) => id === e.target.value))
            items = items.filter((id) => id !== e.target.value);
        else items.push(e.target.value);
        setData("selectedUser", items);
    };

    const deleteData = async (id) => {
        Swal.fire({
            title: "Hapus Pengguna?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("users.destroy", [id]));
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data berhasil dihapus!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setData("selectedUser", []);
            }
        });
    };

    return (
        <>
            <Head title="Pengguna" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconUser size={28} className="text-primary-500" />
                            Pengguna
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {users.total || users.data?.length || 0} pengguna terdaftar
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {canDeleteUsers && data.selectedUser.length > 0 && (
                            <Button
                                type={"bulk"}
                                icon={<IconTrash size={18} />}
                                className={"bg-danger-500 text-white hover:bg-danger-600"}
                                label={`Hapus ${data.selectedUser.length}`}
                                onClick={() => deleteData(data.selectedUser)}
                            />
                        )}
                        {canCreateUsers && (
                            <Button
                                type={"link"}
                                href={route("users.create")}
                                icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                                className={
                                    "bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600"
                                }
                                label={"Tambah Pengguna"}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-80">
                    <Search url={route("users.index")} placeholder="Cari pengguna..." />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`rounded-lg p-2.5 transition-colors ${
                            viewMode === "grid"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`rounded-lg p-2.5 transition-colors ${
                            viewMode === "list"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {users.data.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {users.data.map((user) => {
                            const isSuperAdmin = user.roles?.some(r => r.name === 'super-admin');
                            return (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isSelected={data.selectedUser.includes(user.id.toString())}
                                    onSelect={setSelectedUser}
                                    onDelete={deleteData}
                                    canUpdate={canUpdateUsers}
                                    canDelete={canDeleteUsers && !isSuperAdmin}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <Table.Card title={"Data Pengguna"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className={"w-10"}>
                                        {canDeleteUsers && (
                                            <Checkbox
                                                onChange={(e) => {
                                                    const allUserIds = users.data.map((user) =>
                                                        user.id.toString()
                                                    );
                                                    setData(
                                                        "selectedUser",
                                                        e.target.checked ? allUserIds : []
                                                    );
                                                }}
                                                checked={
                                                    data.selectedUser.length === users.data.length
                                                }
                                            />
                                        )}
                                    </Table.Th>
                                    <Table.Th className={"w-10"}>No</Table.Th>
                                    <Table.Th>Pengguna</Table.Th>
                                    <Table.Th>Group Akses</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.data.map((user, i) => (
                                    <tr
                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        key={user.id}
                                    >
                                        <Table.Td>
                                            {canDeleteUsers && !user.roles?.some(r => r.name === 'super-admin') && (
                                                <Checkbox
                                                    value={user.id}
                                                    onChange={setSelectedUser}
                                                    checked={data.selectedUser.includes(
                                                        user.id.toString()
                                                    )}
                                                />
                                            )}
                                        </Table.Td>
                                        <Table.Td className={"text-center"}>
                                            {++i + (users.current_page - 1) * users.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-400"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
                                                {canUpdateUsers && (
                                                    <Button
                                                        type={"edit"}
                                                        icon={
                                                            <IconPencilCog
                                                                size={16}
                                                                strokeWidth={1.5}
                                                            />
                                                        }
                                                        className={
                                                            "border border-warning-200 bg-warning-100 text-warning-600 hover:bg-warning-200 dark:border-warning-800 dark:bg-warning-900/50 dark:text-warning-400"
                                                        }
                                                        href={route("users.edit", user.id)}
                                                    />
                                                )}
                                                {canDeleteUsers && !user.roles?.some(r => r.name === 'super-admin') && (
                                                    <Button
                                                        type={"delete"}
                                                        icon={
                                                            <IconTrash
                                                                size={16}
                                                                strokeWidth={1.5}
                                                            />
                                                        }
                                                        className={
                                                            "border border-danger-200 bg-danger-100 text-danger-600 hover:bg-danger-200 dark:border-danger-800 dark:bg-danger-900/50 dark:text-danger-400"
                                                        }
                                                        url={route("users.destroy", user.id)}
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
                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-slate-200">
                        Belum Ada Pengguna
                    </h3>
                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                        Tambahkan pengguna pertama Anda.
                    </p>
                    {canCreateUsers && (
                        <Button
                            type={"link"}
                            icon={<IconCirclePlus size={18} />}
                            className={"bg-primary-500 text-white hover:bg-primary-600"}
                            label={"Tambah Pengguna"}
                            href={route("users.create")}
                        />
                    )}
                </div>
            )}

            {users.last_page !== 1 && <Pagination links={users.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
