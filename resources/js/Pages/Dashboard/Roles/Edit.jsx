import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import Input from "@/Components/Dashboard/Input";
import {
    IconArrowLeft,
    IconShieldLock,
    IconCircleCheck,
    IconSquareCheck,
    IconSquare,
} from "@tabler/icons-react";

// Parse permission name to action styles
const getActionBadgeStyle = (action) => {
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

// Group permissions by their module name
const groupPermissionsByModule = (permissions) => {
    const groups = {};
    permissions.forEach((permission) => {
        const parts = permission.name.split("-");
        let moduleName = "";
        let actionName = "";

        if (parts.length > 1) {
            actionName = parts[parts.length - 1];
            moduleName = parts.slice(0, -1).join(" ");
        } else {
            actionName = "access";
            moduleName = permission.name;
        }

        const formattedModule = moduleName.replace(/\b\w/g, (char) => char.toUpperCase());

        if (!groups[formattedModule]) {
            groups[formattedModule] = [];
        }

        groups[formattedModule].push({
            id: permission.id,
            name: permission.name,
            action: actionName.toUpperCase(),
            rawAction: actionName,
        });
    });
    return groups;
};

export default function Edit({ role, permissions = [], rolePermissions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || "",
        selectedPermission: rolePermissions || [],
    });

    const groupedPermissions = groupPermissionsByModule(permissions);

    const handleCheckboxChange = (id) => {
        const isAlreadySelected = data.selectedPermission.includes(id);
        if (isAlreadySelected) {
            setData(
                "selectedPermission",
                data.selectedPermission.filter((item) => item !== id)
            );
        } else {
            setData("selectedPermission", [...data.selectedPermission, id]);
        }
    };

    // Toggle select all permissions inside a module
    const handleToggleModule = (modulePermissions) => {
        const moduleIds = modulePermissions.map((p) => p.id);
        const hasAllSelected = moduleIds.every((id) => data.selectedPermission.includes(id));

        if (hasAllSelected) {
            // Remove all
            setData(
                "selectedPermission",
                data.selectedPermission.filter((id) => !moduleIds.includes(id))
            );
        } else {
            // Add all missing
            const otherSelected = data.selectedPermission.filter((id) => !moduleIds.includes(id));
            setData("selectedPermission", [...otherSelected, ...moduleIds]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    return (
        <>
            <Head title="Ubah Akses Group" />

            {/* Back Header */}
            <div className="mb-6">
                <Link
                    href={route("roles.index")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    <span>Kembali ke Akses Group</span>
                </Link>
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                        <IconShieldLock size={26} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Ubah Akses Group
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Perbarui nama group akses dan atur ulang kewenangan izin aksesnya.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Input Card */}
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="max-w-md">
                        <Input
                            label="Nama Group"
                            type="text"
                            placeholder="Contoh: Manajer, Kasir Senior, Supervisor"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            errors={errors.name}
                            required
                        />
                    </div>
                </div>

                {/* Permissions Title Section */}
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        Daftar Izin & Kewenangan Akses
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui hak akses di bawah ini. Anda dapat mencentang per elemen atau mengklik "Pilih Semua" pada tiap modul.
                    </p>
                </div>

                {/* Module Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(groupedPermissions).map(([moduleName, modulePerms]) => {
                        const hasAllSelected = modulePerms.every((p) =>
                            data.selectedPermission.includes(p.id)
                        );
                        const hasSomeSelected = modulePerms.some((p) =>
                            data.selectedPermission.includes(p.id)
                        );

                        return (
                            <div
                                key={moduleName}
                                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                            >
                                <div>
                                    {/* Header Card */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-250">
                                            {moduleName}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleModule(modulePerms)}
                                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${
                                                hasAllSelected
                                                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                                                    : hasSomeSelected
                                                      ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                      : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
                                            }`}
                                        >
                                            {hasAllSelected ? (
                                                <>
                                                    <IconSquareCheck size={14} />
                                                    <span>Pilih Semua</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IconSquare size={14} />
                                                    <span>Pilih Semua</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Checklist Items */}
                                    <div className="mt-4 space-y-3">
                                        {modulePerms.map((permission) => {
                                            const isChecked = data.selectedPermission.includes(
                                                permission.id
                                            );
                                            return (
                                                <label
                                                    key={permission.id}
                                                    className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                handleCheckboxChange(permission.id)
                                                            }
                                                            className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800"
                                                        />
                                                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                                            {permission.name}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold border tracking-wider uppercase ${getActionBadgeStyle(
                                                            permission.rawAction
                                                        )}`}
                                                    >
                                                        {permission.action}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                    <Link
                        href={route("roles.index")}
                        className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        Batal
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        icon={<IconCircleCheck size={18} />}
                        className="bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20"
                        label="Simpan Perubahan"
                    />
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
