import React from "react";
import { Link, usePage } from "@inertiajs/react";
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

export default function LinkItem({ href, icon, access, title, sidebarOpen, ...props }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    const currentPath = cleanPath(url);
    const targetPath = cleanPath(href);

    // Exact match or subpath match (e.g. nested detail/edit screens)
    const isActive =
        currentPath === targetPath ||
        (targetPath !== "/dashboard" && currentPath.startsWith(targetPath + "/"));
    const canAccess = isSuperAdmin(auth) || access === true;

    if (!canAccess) return null;

    const baseClasses = `
        flex items-center gap-3
        transition-all duration-200 ease-in-out
    `;

    const activeClasses = isActive
        ? "bg-primary-50/80 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-500 font-semibold shadow-sm"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 border-l-4 border-transparent";

    if (sidebarOpen) {
        return (
            <Link
                href={href}
                className={`${baseClasses} ${activeClasses} px-4 py-2.5 text-sm`}
                {...props}
            >
                <span
                    className={`transition-colors duration-200 ${
                        isActive
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-slate-400 dark:text-slate-500"
                    }`}
                >
                    {icon}
                </span>
                <span className="truncate">{title}</span>
            </Link>
        );
    }

    // Collapsed sidebar
    return (
        <Link
            href={href}
            className={`flex w-full justify-center py-3 transition-all duration-200 ease-in-out ${
                isActive
                    ? "border-l-4 border-primary-600 bg-primary-50/80 text-primary-600 dark:border-primary-500 dark:bg-primary-950/40 dark:text-primary-400"
                    : "border-l-4 border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/40 dark:hover:text-slate-200"
            } `}
            title={title}
            {...props}
        >
            {icon}
        </Link>
    );
}
