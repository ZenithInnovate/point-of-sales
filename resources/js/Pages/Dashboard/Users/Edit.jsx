import React, { useRef, useState } from "react";
import { Head, usePage, useForm, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    IconUserEdit,
    IconDeviceFloppy,
    IconArrowLeft,
    IconShield,
    IconUpload,
} from "@tabler/icons-react";
import Input from "@/Components/Dashboard/Input";
import Checkbox from "@/Components/Dashboard/Checkbox";
import toast from "react-hot-toast";

export default function Edit() {
    const { roles, user } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        selectedRoles: user.roles.map((role) => role.name),
        avatar: null,
        _method: "PUT",
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
    const fileInputRef = useRef(null);

    const setSelectedRoles = (e) => {
        let items = [...data.selectedRoles];
        if (items.includes(e.target.value)) {
            items = items.filter((name) => name !== e.target.value);
        } else {
            items.push(e.target.value);
        }
        setData("selectedRoles", items);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("users.update", user.id), {
            onSuccess: () => toast.success("Pengguna berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui pengguna"),
        });
    };

    return (
        <>
            <Head title="Edit Pengguna" />

            <div className="mb-6">
                <Link
                    href={route("users.index")}
                    className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Pengguna
                </Link>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                    <IconUserEdit size={28} className="text-primary-500" />
                    Edit Pengguna
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    {user.name} • {user.email}
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-10">
                    {/* Left Column (30%) */}
                    <div className="space-y-6 lg:col-span-3">
                        {/* Avatar */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Avatar
                            </label>

                            <div className="flex flex-col items-center gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-100 shadow-inner transition-all hover:border-primary-500 hover:bg-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-500"
                                    title="Klik untuk mengunggah avatar"
                                >
                                    {avatarPreview ? (
                                        <>
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-slate-950/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <IconUpload size={16} />
                                                <span className="text-[8px] font-semibold">
                                                    Ganti
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-full text-xl font-bold text-slate-400 transition-colors duration-200 group-hover:text-primary-500 dark:text-slate-500">
                                            {data.name ? (
                                                <span className="group-hover:hidden">
                                                    {data.name.charAt(0).toUpperCase()}
                                                </span>
                                            ) : (
                                                <span className="group-hover:hidden">?</span>
                                            )}
                                            <IconUpload
                                                size={18}
                                                className="hidden group-hover:block"
                                            />
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setData("avatar", file);
                                            setAvatarPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {errors.avatar && (
                                    <p className="mt-1 text-center text-xs text-danger-500">
                                        {errors.avatar}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Roles */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <IconShield size={16} />
                                Akses Group
                            </h3>
                            <div className="space-y-2">
                                {roles.map((role, i) => (
                                    <label
                                        key={i}
                                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                                            data.selectedRoles.includes(role.name)
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                                                : "border-slate-200 hover:border-primary-300 dark:border-slate-800"
                                        }`}
                                    >
                                        <Checkbox
                                            value={role.name}
                                            onChange={setSelectedRoles}
                                            checked={data.selectedRoles.includes(role.name)}
                                        />
                                        <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                                            {role.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.selectedRoles && (
                                <p className="mt-3 text-xs text-danger-500">
                                    {errors.selectedRoles}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column (70%) */}
                    <div className="space-y-6 lg:col-span-7">
                        {/* Account Info */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Informasi Akun
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    type="text"
                                    label="Nama Lengkap"
                                    placeholder="Nama pengguna"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    errors={errors.name}
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    errors={errors.email}
                                    disabled
                                    className="opacity-60"
                                />
                                <Input
                                    type="password"
                                    label="Kata Sandi Baru"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    errors={errors.password}
                                />
                                <Input
                                    type="password"
                                    label="Konfirmasi Kata Sandi"
                                    placeholder="Ulangi kata sandi baru"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                    errors={errors.password_confirmation}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3">
                            <Link
                                href={route("users.index")}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                            >
                                <IconDeviceFloppy size={18} />
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
