import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import Input from "@/Components/Dashboard/Input";
import toast from "react-hot-toast";
import {
    IconMail,
    IconDeviceFloppy,
    IconServer,
    IconKey,
    IconUser,
    IconSettings,
    IconInfoCircle,
} from "@tabler/icons-react";

export default function Email({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        mail_host: settings?.mail_host || "",
        mail_port: settings?.mail_port || "587",
        mail_username: settings?.mail_username || "",
        mail_password: settings?.mail_password || "",
        mail_encryption: settings?.mail_encryption || "tls",
        mail_from_address: settings?.mail_from_address || "",
        mail_from_name: settings?.mail_from_name || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.email.update"), {
            preserveScroll: true,
            onSuccess: () => toast.success("Pengaturan email berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui pengaturan email"),
        });
    };

    return (
        <>
            <Head title="Pengaturan Email" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                        <IconMail size={28} className="text-primary-500" />
                        Pengaturan Email / SMTP
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Atur mail server SMTP eksternal kustom untuk pengiriman email transaksi
                        khusus tenant Anda
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left - SMTP Server Settings */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                                    <IconServer size={18} className="text-primary-500" />
                                    Konfigurasi Server SMTP
                                </h3>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="md:col-span-2">
                                        <Input
                                            type="text"
                                            label="SMTP Host"
                                            value={data.mail_host}
                                            onChange={(e) => setData("mail_host", e.target.value)}
                                            placeholder="smtp.mailgun.org atau smtp.gmail.com"
                                            errors={errors.mail_host}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="text"
                                            label="SMTP Port"
                                            value={data.mail_port}
                                            onChange={(e) => setData("mail_port", e.target.value)}
                                            placeholder="587 atau 465"
                                            errors={errors.mail_port}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Input
                                        type="text"
                                        label="SMTP Username"
                                        value={data.mail_username}
                                        onChange={(e) => setData("mail_username", e.target.value)}
                                        placeholder="postmaster@yourdomain.com"
                                        errors={errors.mail_username}
                                    />
                                    <Input
                                        type="password"
                                        label="SMTP Password"
                                        value={data.mail_password}
                                        onChange={(e) => setData("mail_password", e.target.value)}
                                        placeholder="••••••••••••••••"
                                        errors={errors.mail_password}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Enkripsi Koneksi
                                    </label>
                                    <select
                                        value={data.mail_encryption}
                                        onChange={(e) => setData("mail_encryption", e.target.value)}
                                        className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="tls">
                                            TLS (Direkomendasikan - Port 587)
                                        </option>
                                        <option value="ssl">SSL (Port 465)</option>
                                        <option value="none">
                                            Tanpa Enkripsi (Port 25 / 8025)
                                        </option>
                                    </select>
                                    {errors.mail_encryption && (
                                        <p className="mt-1 text-sm text-danger-500">
                                            {errors.mail_encryption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right - Sender Details & Info */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Sender Info Card */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                                    <IconUser size={18} className="text-primary-500" />
                                    Default Pengirim
                                </h3>

                                <Input
                                    type="email"
                                    label="Email Pengirim (From Email)"
                                    value={data.mail_from_address}
                                    onChange={(e) => setData("mail_from_address", e.target.value)}
                                    placeholder="noreply@tokoanda.com"
                                    errors={errors.mail_from_address}
                                />

                                <Input
                                    type="text"
                                    label="Nama Pengirim (From Name)"
                                    value={data.mail_from_name}
                                    onChange={(e) => setData("mail_from_name", e.target.value)}
                                    placeholder="Toko Anda Utama"
                                    errors={errors.mail_from_name}
                                />
                            </div>

                            {/* Informative Alert */}
                            <div className="space-y-3 rounded-2xl border border-primary-200 bg-primary-50 p-5 dark:border-primary-900/50 dark:bg-primary-950/20">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-primary-800 dark:text-primary-300">
                                    <IconInfoCircle size={18} />
                                    Cara Kerja SMTP SaaS
                                </h4>
                                <p className="text-xs leading-relaxed text-primary-700 dark:text-primary-400">
                                    Jika Anda memasukkan konfigurasi SMTP di atas, seluruh
                                    pengiriman email (seperti struk nota transaksi, email CRM, dan
                                    penyetelan ulang kata sandi) akan dikirim langsung menggunakan
                                    server email pribadi toko Anda.
                                </p>
                                <p className="text-xs font-semibold leading-relaxed text-primary-700 dark:text-primary-400">
                                    * Kosongkan jika ingin menggunakan Server SMTP Global bawaan
                                    aplikasi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <IconDeviceFloppy size={18} />
                            {processing ? "Menyimpan..." : "Simpan Pengaturan Email"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Email.layout = (page) => <DashboardLayout children={page} />;
