import React from "react";
import { Head } from "@inertiajs/react";
import { IconAlertTriangle, IconArrowLeft, IconServer, IconHelpCircle } from "@tabler/icons-react";

export default function LicenseValidation({ tenant_name, tenant_domain, landlord_url }) {
    return (
        <>
            <Head title="Lisensi Domain Tidak Valid" />
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans selection:bg-danger-500 selection:text-white">

                {/* Background Glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-danger-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-danger-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-danger-500/20 animate-pulse">
                            <IconAlertTriangle size={32} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Domain Belum Terdaftar
                        </h1>
                        <p className="text-sm text-slate-400 mt-2">
                            Akses ditolak karena domain ini belum terdaftar dalam lisensi sistem.
                        </p>
                    </div>

                    {/* Tenant Info Card */}
                    <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-6 flex items-start gap-3">
                        <IconServer className="text-danger-400 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Identifikasi Server</p>
                            <p className="text-sm font-bold text-slate-200 mt-0.5">{tenant_name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{tenant_domain}</p>
                        </div>
                    </div>

                    {/* Information Box */}
                    <div className="space-y-4 text-sm text-slate-350 leading-relaxed bg-slate-950/30 rounded-xl p-5 border border-slate-800/40 mb-6">
                        <p style={{ textAlign: 'justify' }}>
                            Sistem mendeteksi bahwa domain ini tidak terdaftar dalam daftar lisensi domain valid yang diperbolehkan beroperasi di server ini.
                        </p>
                        <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-2">
                            <IconHelpCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <span>Silakan hubungi administrator untuk mendaftarkan lisensi domain ini secara resmi.</span>
                        </p>
                    </div>

                    {/* Aksi Kembali */}
                    <div className="pt-2">
                        <a
                            href={landlord_url}
                            className="w-full py-3 px-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm"
                        >
                            <IconArrowLeft size={16} />
                            <span>Kembali</span>
                        </a>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-xs text-slate-600">
                        AkarPOS SaaS Multi-Tenancy System &bull; Domain Protection
                    </div>

                </div>
            </div>
        </>
    );
}
