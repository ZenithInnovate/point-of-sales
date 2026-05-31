import React, { useMemo, useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { IconChevronDown, IconChevronUp, IconCornerDownRight } from "@tabler/icons-react";
import { isSuperAdmin } from "@/Utils/authorization";

// Helper to clean and compare paths robustly
const cleanPath = (urlStr) => {
    if (!urlStr) return "";
    let path = urlStr;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("//")) {
        try {
            path = new URL(path).pathname;
        } catch (e) {
            // fallback
        }
    }
    path = path.split("?")[0].split("#")[0];
    if (path.endsWith("/") && path !== "/") {
        path = path.slice(0, -1);
    }
    return path;
};

export default function LinkItemDropdown({ icon, title, data, access, sidebarOpen, ...props }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const superAdmin = isSuperAdmin(auth);

    const visibleItems = useMemo(
        () => data.filter((item) => superAdmin || item.permissions === true),
        [data, superAdmin]
    );

    // Check if any sub-item is active
    const isAnyChildActive = useMemo(() => {
        return visibleItems.some((item) => {
            const currentPath = cleanPath(url);
            const targetPath = cleanPath(item.href);
            return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
        });
    }, [visibleItems, url]);

    const [isOpen, setIsOpen] = useState(isAnyChildActive);

    // Auto expand if any child is active (e.g. after navigating)
    useEffect(() => {
        if (isAnyChildActive) {
            setIsOpen(true);
        }
    }, [isAnyChildActive]);

    const canRenderParent = superAdmin || access === true || visibleItems.length > 0;

    if (!canRenderParent || visibleItems.length === 0) {
        return null;
    }

    const buttonClass = sidebarOpen
        ? `w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 ease-in-out border-l-4 cursor-pointer capitalize
           ${
               isAnyChildActive
                   ? "text-slate-800 dark:text-slate-200 font-semibold bg-slate-50/50 dark:bg-slate-800/10 border-primary-500/50"
                   : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/30 border-transparent"
           }`
        : `w-full flex justify-center py-3 transition-all duration-200 ease-in-out border-l-4 cursor-pointer
           ${
               isAnyChildActive
                   ? "text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/20 border-primary-500"
                   : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30 border-transparent"
           }`;

    return (
        <>
            <button className={buttonClass} onClick={() => setIsOpen(!isOpen)}>
                {sidebarOpen ? (
                    <>
                        <div className="flex items-center gap-3">
                            <span
                                className={
                                    isAnyChildActive
                                        ? "text-primary-500 dark:text-primary-400"
                                        : "text-slate-400 dark:text-slate-500"
                                }
                            >
                                {icon}
                            </span>
                            <span className="truncate">{title}</span>
                        </div>
                        {isOpen ? (
                            <IconChevronUp size={16} strokeWidth={2} className="text-slate-400" />
                        ) : (
                            <IconChevronDown size={16} strokeWidth={2} className="text-slate-400" />
                        )}
                    </>
                ) : !isOpen ? (
                    icon
                ) : (
                    <IconChevronDown size={20} strokeWidth={1.5} />
                )}
            </button>

            {isOpen &&
                visibleItems.map((item, index) => {
                    const currentPath = cleanPath(url);
                    const targetPath = cleanPath(item.href);
                    const isChildActive =
                        currentPath === targetPath || currentPath.startsWith(targetPath + "/");

                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`border-l-4 transition-all duration-200 ease-in-out ${
                                isChildActive
                                    ? "border-primary-500 bg-primary-50/60 font-semibold text-primary-700 dark:bg-primary-950/20 dark:text-primary-400"
                                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-slate-200"
                            } ${
                                sidebarOpen
                                    ? "flex w-full cursor-pointer items-center gap-3 py-2 pl-8 pr-4 text-xs capitalize"
                                    : "flex w-full cursor-pointer justify-center py-2.5"
                            } `}
                            {...props}
                        >
                            {sidebarOpen ? (
                                <>
                                    <IconCornerDownRight
                                        size={14}
                                        strokeWidth={2}
                                        className={
                                            isChildActive ? "text-primary-500" : "text-slate-400"
                                        }
                                    />{" "}
                                    <span className="truncate">{item.title}</span>
                                </>
                            ) : (
                                item.icon
                            )}
                        </Link>
                    );
                })}
        </>
    );
}
