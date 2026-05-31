import { useTheme } from "@/Context/ThemeSwitcherContext";
import React from "react";

export default function Widget({ title, icon, subtitle, className, total, color }) {
    return (
        <div
            className={`${className} rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-950`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
                    <div className="flex flex-col">
                        <div className="font-semibold text-gray-900 dark:text-gray-200">
                            {title}
                        </div>
                        <div className="text-xs text-gray-500">{subtitle}</div>
                    </div>
                </div>
                <div className="p-2 font-mono text-base font-semibold text-gray-900 dark:text-white">
                    {total}
                </div>
            </div>
        </div>
    );
}
