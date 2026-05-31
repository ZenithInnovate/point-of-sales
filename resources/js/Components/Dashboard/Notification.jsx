import React, { useState, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
    IconBell,
    IconDots,
    IconCircleCheck,
    IconPackage,
    IconReceipt,
    IconCurrencyDollar,
} from "@tabler/icons-react";
import { usePage, router } from "@inertiajs/react";

export default function Notification() {
    const {
        lowStockNotifications = [],
        receivableNotifications = [],
        payableNotifications = [],
    } = usePage().props;

    const mapItems = (items) =>
        items.map((item) => ({
            ...item,
            type: item.type || "stock",
            icon:
                item.type === "receivable" ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <IconReceipt size={18} />
                    </span>
                ) : item.type === "payable" ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <IconCurrencyDollar size={18} />
                    </span>
                ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                        <IconPackage size={18} />
                    </span>
                ),
        }));

    const mergeData = () => [
        ...mapItems(
            lowStockNotifications.map((n) => ({
                ...n,
                id: `stock-${n.id}`,
                originalId: n.id,
                title: `Stok habis: ${n.title}`,
                subtitle: `Stok: ${n.stock}`,
                type: "stock",
            }))
        ),
        ...mapItems(
            receivableNotifications.map((n) => ({
                ...n,
                id: `recv-${n.id}`,
                type: "receivable",
            }))
        ),
        ...mapItems(
            payableNotifications.map((n) => ({
                ...n,
                id: `pay-${n.id}`,
                type: "payable",
            }))
        ),
    ];

    const [data, setData] = useState(mergeData());

    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);

    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousedown", handleClickOutside);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Sync when low stock changes (e.g., restocked items disappear)
    useEffect(() => {
        setData(mergeData());
    }, [lowStockNotifications, receivableNotifications, payableNotifications]);

    const handleMarkRead = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
        const item = data.find((d) => d.id === id);
        if (item?.type === "stock") {
            router.post(
                route("notifications.stock.read"),
                { product_id: item.originalId || id },
                { preserveScroll: true, preserveState: true }
            );
        }
    };

    const handleMarkAllRead = () => {
        setData([]);
        router.post(
            route("notifications.stock.readAll"),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const badgeCount = data.length;

    const NotificationList = () => (
        <div className="flex max-h-80 flex-col items-start gap-3 overflow-y-auto pr-1">
            {badgeCount === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">Tidak ada notifikasi</div>
            )}
            {data.map((item) => (
                <div
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-primary-200 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800"
                    key={item.id}
                >
                    <div className="flex items-center gap-4">
                        {item.icon}
                        <div>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 md:text-base">
                                {item.title}
                            </div>
                            <div className="text-xs text-gray-500 md:text-sm">
                                {item.subtitle} {item.time && `• ${item.time}`}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleMarkRead(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1 text-xs font-semibold text-primary-600 hover:border-primary-200 hover:bg-primary-50 dark:text-primary-300 dark:hover:border-primary-800 dark:hover:bg-primary-900/30"
                    >
                        <IconCircleCheck size={16} />
                        Dibaca
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <>
            {isMobile === false ? (
                <Menu className="relative z-50" as="div">
                    <Menu.Button className="group flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition hover:shadow dark:border-slate-800 dark:bg-slate-900">
                        <div className="absolute -right-2 top-0 rounded-md border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-500 duration-200 ease-in hover:bg-rose-500/20 group-hover:scale-110">
                            {badgeCount}
                        </div>
                        <IconBell
                            strokeWidth={1.5}
                            size={22}
                            className="text-gray-700 dark:text-gray-400"
                        />
                    </Menu.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className="absolute z-[100] w-[600px] max-w-[94vw] rounded-2xl border bg-white shadow-2xl dark:border-gray-900 dark:bg-gray-950 md:right-0">
                            <div className="flex items-center justify-between gap-2 border-b p-4 dark:border-gray-900">
                                <div className="flex items-center gap-2 text-xl font-bold text-gray-700 dark:text-gray-200">
                                    Notifikasi
                                </div>
                                <div className="flex items-center gap-2">
                                    {badgeCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                        >
                                            Tandai dibaca
                                        </button>
                                    )}
                                    <IconDots
                                        className="text-gray-500 dark:text-gray-200"
                                        size={24}
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <NotificationList />
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            ) : (
                <div ref={notificationRef}>
                    <button
                        className="group relative flex items-center rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="absolute -right-2 top-0 rounded-md border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-500 duration-200 ease-in hover:bg-rose-500/20 group-hover:scale-110">
                            {badgeCount}
                        </div>
                        <IconBell
                            strokeWidth={1.5}
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    </button>
                    <div
                        className={`${
                            isOpen ? "translate-x-0 opacity-100" : "translate-x-full"
                        } fixed right-0 top-0 z-50 h-full w-[300px] transform border-l bg-white transition-all duration-300 dark:border-gray-900 dark:bg-gray-950`}
                    >
                        <div className="mt-2 flex items-center justify-between gap-2 border-b p-4 dark:border-gray-900">
                            <div className="text-base font-bold text-gray-500 dark:text-gray-400">
                                Notifications
                            </div>
                            <IconDots className="text-gray-500 dark:text-gray-400" size={24} />
                        </div>
                        <div className="p-4">
                            <div className="flex h-screen flex-col items-start gap-3 overflow-y-auto">
                                <NotificationList />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
