import React from "react";

export default function Card({ icon, title, children, footer, className, form }) {
    const CardWrapper = form ? "form" : "div";
    const wrapperProps = form ? { onSubmit: form } : {};

    return (
        <CardWrapper {...wrapperProps}>
            {/* Header */}
            <div
                className={`rounded-t-2xl border border-b-0 px-5 py-4 ${className} border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900`}
            >
                <div className="flex items-center gap-2.5">
                    {icon && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="border-x border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-900">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div
                    className={`rounded-b-2xl border border-t-0 px-5 py-4 ${className} border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50`}
                >
                    {footer}
                </div>
            )}
        </CardWrapper>
    );
}
