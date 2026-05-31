import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import toast from "react-hot-toast";
import { IconUsers, IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";

export default function Create() {
    const { errors, provinces = [], tierOptions = [] } = usePage().props;

    const { data, setData, post, processing } = useForm({
        name: "",
        no_telp: "",
        address: "",
        is_loyalty_member: false,
        loyalty_tier: "regular",
        province_id: "",
        regency_id: "",
        district_id: "",
        village_id: "",
    });

    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const fetchRegencies = async (provinceId) => {
        if (!provinceId) {
            setRegencies([]);
            return;
        }
        const res = await axios.get(route("regions.regencies"), {
            params: { province_id: provinceId },
        });
        setRegencies(res.data);
    };

    const fetchDistricts = async (regencyId) => {
        if (!regencyId) {
            setDistricts([]);
            return;
        }
        const res = await axios.get(route("regions.districts"), {
            params: { regency_id: regencyId },
        });
        setDistricts(res.data);
    };

    const fetchVillages = async (districtId) => {
        if (!districtId) {
            setVillages([]);
            return;
        }
        const res = await axios.get(route("regions.villages"), {
            params: { district_id: districtId },
        });
        setVillages(res.data);
    };

    // reset children when parent changes
    useEffect(() => {
        setData("regency_id", "");
        setData("district_id", "");
        setData("village_id", "");
        setDistricts([]);
        setVillages([]);
        fetchRegencies(data.province_id);
    }, [data.province_id]);

    useEffect(() => {
        setData("district_id", "");
        setData("village_id", "");
        setVillages([]);
        fetchDistricts(data.regency_id);
    }, [data.regency_id]);

    useEffect(() => {
        setData("village_id", "");
        fetchVillages(data.district_id);
    }, [data.district_id]);

    const submit = (e) => {
        e.preventDefault();
        post(route("customers.store"), {
            onSuccess: () => toast.success("Pelanggan berhasil ditambahkan"),
            onError: () => toast.error("Gagal menyimpan pelanggan"),
        });
    };

    return (
        <>
            <Head title="Tambah Pelanggan" />

            <div className="mb-6">
                <Link
                    href={route("customers.index")}
                    className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Pelanggan
                </Link>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                    <IconUsers size={28} className="text-primary-500" />
                    Tambah Pelanggan Baru
                </h1>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-3xl">
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                type="text"
                                label="Nama Pelanggan"
                                placeholder="Masukkan nama lengkap"
                                errors={errors.name}
                                onChange={(e) => setData("name", e.target.value)}
                                value={data.name}
                            />
                            <Input
                                type="text"
                                label="No. Handphone"
                                placeholder="08xxxxxxxxxx"
                                errors={errors.no_telp}
                                onChange={(e) => setData("no_telp", e.target.value)}
                                value={data.no_telp}
                            />
                        </div>

                        <div className="rounded-2xl border border-primary-100 bg-primary-50/70 p-4 dark:border-primary-900/40 dark:bg-primary-950/20">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Aktivasi Loyalty Member
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Member mendapat poin, voucher, dan harga khusus.
                                    </p>
                                </div>
                                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.is_loyalty_member}
                                        onChange={(e) =>
                                            setData("is_loyalty_member", e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-primary-500"
                                    />
                                    Member
                                </label>
                            </div>

                            {data.is_loyalty_member && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tier Awal
                                    </label>
                                    <select
                                        value={data.loyalty_tier}
                                        onChange={(e) => setData("loyalty_tier", e.target.value)}
                                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        {tierOptions.map((tier) => (
                                            <option key={tier.value} value={tier.value}>
                                                {tier.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Provinsi
                                </label>
                                <select
                                    value={data.province_id}
                                    onChange={(e) => setData("province_id", e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map((prov) => (
                                        <option key={prov.code} value={prov.code}>
                                            {prov.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.province_id && (
                                    <p className="mt-1 text-xs text-danger-500">
                                        {errors.province_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Kota/Kabupaten
                                </label>
                                <select
                                    value={data.regency_id}
                                    onChange={(e) => setData("regency_id", e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                    disabled={!data.province_id}
                                >
                                    <option value="">Pilih Kota/Kabupaten</option>
                                    {regencies.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.regency_id && (
                                    <p className="mt-1 text-xs text-danger-500">
                                        {errors.regency_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Kecamatan
                                </label>
                                <select
                                    value={data.district_id}
                                    onChange={(e) => setData("district_id", e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                    disabled={!data.regency_id}
                                >
                                    <option value="">Pilih Kecamatan</option>
                                    {districts.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.district_id && (
                                    <p className="mt-1 text-xs text-danger-500">
                                        {errors.district_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Kelurahan
                                </label>
                                <select
                                    value={data.village_id}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData("village_id", val);
                                    }}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                                    disabled={!data.district_id}
                                >
                                    <option value="">Pilih Kelurahan</option>
                                    {villages.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.village_id && (
                                    <p className="mt-1 text-xs text-danger-500">
                                        {errors.village_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Textarea
                            label="Alamat Detail"
                            placeholder="Alamat lengkap pelanggan"
                            errors={errors.address}
                            onChange={(e) => setData("address", e.target.value)}
                            value={data.address}
                            rows={3}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                        <Link
                            href={route("customers.index")}
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
            </form>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
