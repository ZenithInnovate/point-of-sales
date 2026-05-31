import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import Input from "@/Components/Dashboard/Input";
import ListBox from "@/Components/Dashboard/ListBox";
import Modal from "@/Components/Dashboard/Modal";
import Search from "@/Components/Dashboard/Search";
import Pagination from "@/Components/Dashboard/Pagination";
import { useAuthorization } from "@/Utils/authorization";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconTrash,
    IconUserShield,
    IconPencilCog,
    IconPencilCheck,
    IconShield,
} from "@tabler/icons-react";

// Role Card Component
function RoleCard({ role, onEdit, onDelete, canUpdate, canDelete }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                        <IconUserShield size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-200">
                            {role.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {role.permissions.length} hak akses
                        </p>
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div className="bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="scrollbar-thin flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                    {role.permissions.slice(0, 8).map((permission, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-400"
                        >
                            <IconShield size={10} />
                            {permission.name}
                        </span>
                    ))}
                    {role.permissions.length > 8 && (
                        <span className="px-2 py-0.5 text-xs font-medium text-slate-500">
                            +{role.permissions.length - 8} lainnya
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            {(canUpdate || canDelete) && (
                <div className="flex border-t border-slate-100 dark:border-slate-800">
                    {canUpdate && (
                        <button
                            onClick={onEdit}
                            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-warning-600 transition-colors hover:bg-warning-50 dark:hover:bg-warning-950/50"
                        >
                            <IconPencilCog size={16} />
                            <span>Edit</span>
                        </button>
                    )}
                    {canUpdate && canDelete && (
                        <div className="w-px bg-slate-100 dark:bg-slate-800" />
                    )}
                    {canDelete && (
                        <button
                            onClick={onDelete}
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
    const { roles, permissions, errors } = usePage().props;
    const { can } = useAuthorization();
    const canCreateRoles = can("roles-create");
    const canUpdateRoles = can("roles-update");
    const canDeleteRoles = can("roles-delete");

    const {
        data,
        setData,
        transform,
        post,
        delete: destroy,
    } = useForm({
        id: "",
        name: "",
        selectedPermission: [],
        isUpdate: false,
        isOpen: false,
    });

    const setSelectedPermission = (value) => setData("selectedPermission", value);

    transform((data) => ({
        ...data,
        selectedPermission: data.selectedPermission.map((permission) => permission.id),
        _method: data.isUpdate === true ? "put" : "post",
    }));

    const saveRole = async (e) => {
        e.preventDefault();
        post(route("roles.store"), {
            onSuccess: () => setData({ selectedPermission: [], name: "", isOpen: false }),
        });
    };

    const updateRole = async (e) => {
        e.preventDefault();
        post(route("roles.update", data.id), {
            onSuccess: () =>
                setData({
                    id: "",
                    name: "",
                    selectedPermission: [],
                    isUpdate: false,
                    isOpen: false,
                }),
        });
    };

    const handleEdit = (role) => {
        setData({
            id: role.id,
            selectedPermission: role.permissions,
            name: role.name,
            isUpdate: true,
            isOpen: true,
        });
    };

    const handleDelete = (roleId) => {
        if (confirm("Hapus role ini?")) {
            destroy(route("roles.destroy", roleId));
        }
    };

    return (
        <>
            <Head title="Akses Group" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconUserShield size={28} className="text-primary-500" />
                            Akses Group
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {roles.total || roles.data?.length || 0} group terdaftar
                        </p>
                    </div>
                    {canCreateRoles && (
                        <Button
                            type={"button"}
                            icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                            className={
                                "bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600"
                            }
                            label={"Tambah Group"}
                            onClick={() => setData("isOpen", true)}
                        />
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="mb-4 w-full sm:w-80">
                <Search url={route("roles.index")} placeholder="Cari akses group..." />
            </div>

            {/* Modal */}
            <Modal
                show={data.isOpen}
                onClose={() =>
                    setData({
                        isOpen: false,
                        id: "",
                        name: "",
                        selectedPermission: [],
                        isUpdate: false,
                    })
                }
                title={data.isUpdate ? "Ubah Akses Group" : "Tambah Akses Group"}
                icon={<IconUserShield size={20} strokeWidth={1.5} />}
            >
                <form onSubmit={data.isUpdate ? updateRole : saveRole}>
                    <div className="mb-4">
                        <Input
                            label={"Nama group"}
                            type={"text"}
                            placeholder={"Masukan nama group"}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            errors={errors.name}
                        />
                    </div>
                    <div className="mb-4">
                        <ListBox
                            label={"Pilih hak akses"}
                            data={permissions}
                            selected={data.selectedPermission}
                            setSelected={setSelectedPermission}
                            errors={errors.selectedPermission}
                        />
                    </div>
                    <Button
                        type={"submit"}
                        icon={<IconPencilCheck size={18} />}
                        className={
                            "w-full justify-center bg-primary-500 text-white hover:bg-primary-600"
                        }
                        label={"Simpan"}
                    />
                </form>
            </Modal>

            {/* Content */}
            {roles.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {roles.data.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={() => handleEdit(role)}
                            onDelete={() => handleDelete(role.id)}
                            canUpdate={canUpdateRoles}
                            canDelete={canDeleteRoles}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-slate-200">
                        Belum Ada Group
                    </h3>
                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                        Tambahkan group akses pertama.
                    </p>
                    <Button
                        type={"button"}
                        icon={<IconCirclePlus size={18} />}
                        className={"bg-primary-500 text-white hover:bg-primary-600"}
                        label={"Tambah Group"}
                        onClick={() => setData("isOpen", true)}
                    />
                </div>
            )}

            {roles.last_page !== 1 && <Pagination links={roles.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
