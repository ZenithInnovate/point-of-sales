import React from "react";

export default function Header({ children, title, subtitle }) {
    return (
        <div className="mb-2 flex w-full items-center justify-between gap-4">
            <div className="">
                <div className="text-lg font-bold capitalize text-gray-200">{title}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
            </div>
            {children}
        </div>
    );
}
