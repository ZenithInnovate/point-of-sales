import { Head, Link } from "@inertiajs/react";
import {
    IconShoppingCart,
    IconReceipt,
    IconUsers,
    IconChartBar,
    IconBox,
    IconBrandGithub,
    IconArrowRight,
    IconCheck,
    IconDeviceMobile,
    IconCloudLock,
    IconReportMoney,
} from "@tabler/icons-react";

export default function Welcome() {
    const features = [
        {
            icon: IconShoppingCart,
            title: "Transaksi Cepat",
            desc: "Proses jual beli dalam hitungan detik",
        },
        {
            icon: IconReceipt,
            title: "Cetak Struk",
            desc: "Print thermal 58mm, 80mm, dan invoice",
        },
        {
            icon: IconUsers,
            title: "Pelanggan & History",
            desc: "Kelola data pelanggan dan riwayat",
        },
        {
            icon: IconBox,
            title: "Inventori Produk",
            desc: "Stok, kategori, dan barcode scanner",
        },
        {
            icon: IconChartBar,
            title: "Laporan Lengkap",
            desc: "Penjualan, keuntungan, dan grafik",
        },
        {
            icon: IconReportMoney,
            title: "Multi Payment",
            desc: "Tunai, QRIS, dan Midtrans",
        },
    ];

    const techStack = [
        { name: "Laravel 12", color: "bg-red-500" },
        { name: "Inertia.js", color: "bg-purple-500" },
        { name: "React", color: "bg-cyan-500" },
        { name: "TailwindCSS", color: "bg-sky-500" },
        { name: "MySQL", color: "bg-orange-500" },
    ];

    return (
        <>
            <Head title="Aplikasi Kasir - AkarPOS Modern" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Navbar */}
                <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
                                <IconShoppingCart size={22} className="text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                Aplikasi Kasir
                            </span>
                        </div>

                        <div className="hidden items-center gap-8 md:flex">
                            <a
                                href="#features"
                                className="text-sm text-slate-600 transition-colors hover:text-primary-500 dark:text-slate-400"
                            >
                                Fitur
                            </a>
                            <a
                                href="#tech"
                                className="text-sm text-slate-600 transition-colors hover:text-primary-500 dark:text-slate-400"
                            >
                                Teknologi
                            </a>
                            <a
                                href="#install"
                                className="text-sm text-slate-600 transition-colors hover:text-primary-500 dark:text-slate-400"
                            >
                                Instalasi
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-primary-500 dark:text-slate-300"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-600 hover:to-primary-700"
                            >
                                Daftar Gratis
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="px-6 pb-20 pt-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                                <IconDeviceMobile size={16} />
                                Responsive & Mobile-Friendly
                            </div>

                            <h1 className="text-5xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-6xl">
                                Sistem AkarPOS
                                <span className="mt-2 block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                                    Modern & Mudah Digunakan
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                                Aplikasi kasir berbasis web untuk warung & toko kecil–menengah.
                                Mendukung pencatatan transaksi, laporan, manajemen produk,
                                pelanggan, dan banyak lagi.
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/register"
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-primary-500/30 transition-all hover:from-primary-600 hover:to-primary-700 sm:w-auto"
                                >
                                    Mulai Sekarang
                                    <IconArrowRight size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="relative mt-16">
                            <div className="pointer-events-none absolute inset-0 bottom-0 top-auto z-10 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 dark:bg-slate-800">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 text-center text-xs text-slate-500">
                                        dashboard.aplikasikasir.com
                                    </div>
                                </div>
                                <img
                                    src="/media/revamp-pos.png"
                                    alt="Preview POS Dashboard"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Version Comparison */}
                <section className="bg-gradient-to-br from-slate-100 to-slate-200 px-6 py-20 dark:from-slate-900 dark:to-slate-800">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                                <IconArrowRight size={16} />
                                Before & After
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                                Perjalanan Evolusi
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                                Dari versi pertama hingga redesign modern dengan UI/UX yang lebih
                                baik
                            </p>
                        </div>

                        {/* Comparison Grid */}
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* V1 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                                    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium dark:bg-slate-700">
                                        Version 1.0
                                    </span>
                                </div>
                                <div className="overflow-hidden rounded-xl border border-slate-300 shadow-lg dark:border-slate-600">
                                    <img
                                        src="/media/readme-pos.png"
                                        alt="POS V1"
                                        className="w-full"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-xl border border-slate-300 shadow-lg dark:border-slate-600">
                                    <img
                                        src="/media/readme-dashboard.png"
                                        alt="Dashboard V1"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Revamp */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 text-sm font-medium text-white">
                                        ✨ Revamp 2.0
                                    </span>
                                </div>
                                <div className="overflow-hidden rounded-xl border-2 border-primary-500 shadow-lg shadow-primary-500/20">
                                    <img
                                        src="/media/revamp-pos.png"
                                        alt="POS Revamp"
                                        className="w-full"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-xl border-2 border-primary-500 shadow-lg shadow-primary-500/20">
                                    <img
                                        src="/media/revamp-dashboard.png"
                                        alt="Dashboard Revamp"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-white px-6 py-20 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                                Fitur Lengkap
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                                Semua yang Anda butuhkan untuk mengelola bisnis retail dalam satu
                                aplikasi
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-primary-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-primary-800"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 transition-transform group-hover:scale-110">
                                        <feature.icon size={24} className="text-white" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section id="tech" className="px-6 py-20">
                    <div className="mx-auto max-w-7xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                            Tech Stack
                        </h2>
                        <p className="mb-12 text-slate-600 dark:text-slate-400">
                            Dibangun dengan teknologi modern yang cepat dan stabil
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {techStack.map((tech, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3 dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <div className={`h-3 w-3 rounded-full ${tech.color}`} />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {tech.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Installation */}
                <section id="install" className="bg-white px-6 py-20 dark:bg-slate-900">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                                Panduan Instalasi
                            </h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">
                                Clone repository dan jalankan dalam hitungan menit
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 p-12 text-white">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Siap Memulai?</h2>
                            <p className="mb-8 text-lg opacity-90">
                                Daftarkan bisnis Anda sekarang dan rasakan kemudahannya
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-primary-600 transition-colors hover:bg-slate-50"
                            >
                                Daftar Gratis Sekarang
                                <IconArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-200 px-6 py-8 dark:border-slate-800">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                                <IconShoppingCart size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                Aplikasi Kasir
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} Dibuat oleh AkarDev.com
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
