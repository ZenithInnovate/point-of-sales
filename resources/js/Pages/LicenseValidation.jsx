import React from "react";
import { Head } from "@inertiajs/react";
import { IconAlertTriangle, IconArrowLeft, IconServer, IconHelpCircle } from "@tabler/icons-react";

export default function LicenseValidation({ tenant_name, tenant_domain, landlord_url }) {
    return (
        <>
            <Head title="Lisensi Domain Tidak Valid" />
            <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans text-slate-100 selection:bg-danger-500 selection:text-white">
                {/* Background Glow effects */}
                <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-danger-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-tr from-danger-500 to-amber-500 shadow-lg shadow-danger-500/20">
                            <IconAlertTriangle size={32} className="text-white" />
                        </div>
                        <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                            Domain Belum Terdaftar
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Akses ditolak karena domain ini belum terdaftar dalam lisensi sistem.
                        </p>
                    </div>

                    {/* Tenant Info Card */}
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                        <IconServer className="mt-0.5 flex-shrink-0 text-danger-400" size={18} />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Identifikasi Server
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-slate-200">{tenant_name}</p>
                            <p className="mt-0.5 font-mono text-xs text-slate-400">
                                {tenant_domain}
                            </p>
                        </div>
                    </div>

                    {/* Information Box */}
                    <div className="text-slate-350 mb-6 space-y-4 rounded-xl border border-slate-800/40 bg-slate-950/30 p-5 text-sm leading-relaxed">
                        <p style={{ textAlign: "justify" }}>
                            Sistem mendeteksi bahwa domain ini tidak terdaftar dalam daftar lisensi
                            domain valid yang diperbolehkan beroperasi di server ini.
                        </p>
                        <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                            <IconHelpCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <span>
                                Silakan hubungi administrator untuk mendaftarkan lisensi domain ini
                                secara resmi.
                            </span>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-slate-600">
                        AkarPOS SaaS Multi-Tenancy System &bull; Domain Protection
                    </div>
                </div>
            </div>
        </>
    );
}
