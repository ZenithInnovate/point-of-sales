import React, { useState, useRef } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import toast from "react-hot-toast";
import {
    IconCategory,
    IconDeviceFloppy,
    IconArrowLeft,
    IconPhoto,
    IconUpload,
} from "@tabler/icons-react";

export default function Create() {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        name: "",
        description: "",
        image: "",
    });

    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("categories.store"), {
            onSuccess: () => toast.success("Kategori berhasil ditambahkan"),
            onError: () => toast.error("Gagal menyimpan kategori"),
        });
    };

    return (
        <>
            <Head title="Tambah Kategori" />

            <div className="mb-6">
                <Link
                    href={route("categories.index")}
                    className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Kategori
                </Link>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                    <IconCategory size={28} className="text-primary-500" />
                    Tambah Kategori Baru
                </h1>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-2xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Image */}
                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <IconPhoto size={16} />
                                    Gambar
                                </h3>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative mb-3 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 transition-all hover:border-primary-500 hover:bg-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-500"
                                    title="Klik untuk mengunggah gambar"
                                >
                                    {imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <IconUpload size={20} />
                                                <span className="mt-1 text-[10px] font-semibold">
                                                    Ganti Gambar
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-slate-400 transition-colors duration-200 group-hover:text-primary-500 dark:text-slate-500">
                                            <IconPhoto size={32} />
                                            <span className="text-[10px] font-semibold">
                                                Unggah Gambar
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    label="Nama Kategori"
                                    placeholder="Masukkan nama"
                                    errors={errors.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    value={data.name}
                                />
                                <Textarea
                                    label="Deskripsi"
                                    placeholder="Deskripsi kategori"
                                    errors={errors.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    value={data.description}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                            <Link
                                href={route("categories.index")}
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
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
