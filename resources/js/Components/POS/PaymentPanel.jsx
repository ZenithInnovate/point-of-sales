import React, { useMemo } from "react";
import {
    IconCash,
    IconCreditCard,
    IconReceipt,
    IconArrowRight,
    IconCheck,
    IconAlertCircle,
    IconBuildingBank,
} from "@tabler/icons-react";

const formatPrice = (value = 0) =>
    Number(value || 0).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

// Quick Amount Button
function QuickAmountButton({ amount, onClick, isSelected }) {
    return (
        <button
            type="button"
            onClick={() => onClick(amount)}
            className={`min-h-touch flex-1 rounded-xl px-2 py-3 text-sm font-semibold transition-all duration-200 ${
                isSelected
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
                    : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            } `}
        >
            {formatPrice(amount)}
        </button>
    );
}

// Payment Method Card
function PaymentMethodCard({ method, isSelected, onClick }) {
    const getIcon = () => {
        if (method.value === "cash") return IconCash;
        if (method.value === "bank_transfer") return IconBuildingBank;
        return IconCreditCard;
    };
    const IconComponent = getIcon();

    return (
        <button
            type="button"
            onClick={() => onClick(method.value)}
            className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            } `}
        >
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected
                        ? "bg-primary-500 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                } `}
            >
                <IconComponent size={20} />
            </div>
            <div className="flex-1">
                <p
                    className={`text-sm font-semibold ${
                        isSelected
                            ? "text-primary-700 dark:text-primary-300"
                            : "text-slate-800 dark:text-slate-200"
                    }`}
                >
                    {method.label}
                </p>
                {method.description && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {method.description}
                    </p>
                )}
            </div>
            {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                    <IconCheck size={14} />
                </div>
            )}
        </button>
    );
}

// Main PaymentPanel Component
export default function PaymentPanel({
    subtotal = 0,
    promoDiscount = 0,
    voucherDiscount = 0,
    loyaltyDiscount = 0,
    discount = 0,
    discountInput = "",
    onDiscountChange,
    redeemPointsInput = "",
    onRedeemPointsChange,
    availablePoints = 0,
    selectedVoucherId = "",
    voucherOptions = [],
    onVoucherChange,
    cash = 0,
    cashInput = "",
    onCashChange,
    paymentMethod = "cash",
    onPaymentMethodChange,
    paymentOptions = [],
    bankAccounts = [],
    selectedBankAccount = null,
    onBankAccountChange,
    onSubmit,
    isSubmitting = false,
    hasItems = false,
    selectedCustomer = null,
    className = "",
}) {
    // Quick amount options
    const quickAmounts = [10000, 20000, 50000, 100000];

    // Calculations
    const payable = Math.max(subtotal - discount, 0);
    const isCashPayment = paymentMethod === "cash";
    const isBankTransfer = paymentMethod === "bank_transfer";
    const change = isCashPayment ? Math.max(cash - payable, 0) : 0;
    const remaining = isCashPayment ? Math.max(payable - cash, 0) : 0;

    // Validation
    const canSubmit =
        hasItems &&
        selectedCustomer &&
        (isCashPayment ? cash >= payable : true) &&
        (isBankTransfer ? selectedBankAccount !== null : true) &&
        !isSubmitting;

    // Submit label
    const submitLabel = useMemo(() => {
        if (!hasItems) return "Keranjang Kosong";
        if (!selectedCustomer) return "Pilih Pelanggan";
        if (isCashPayment && remaining > 0) return `Kurang ${formatPrice(remaining)}`;
        return "Selesaikan Transaksi";
    }, [hasItems, selectedCustomer, isCashPayment, remaining]);

    return (
        <div className={`flex h-full flex-col ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
                <IconReceipt size={20} className="text-slate-600 dark:text-slate-400" />
                <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                    Pembayaran
                </h2>
            </div>

            {/* Content */}
            <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-4">
                {/* Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            {formatPrice(subtotal)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Promo Otomatis</span>
                        <span className="font-medium text-danger-500">
                            - {formatPrice(promoDiscount)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Voucher</span>
                        <span className="font-medium text-danger-500">
                            - {formatPrice(voucherDiscount)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Redeem Poin</span>
                        <span className="font-medium text-danger-500">
                            - {formatPrice(loyaltyDiscount)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Diskon</span>
                        <span className="font-medium text-danger-500">
                            - {formatPrice(discount)}
                        </span>
                    </div>
                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex justify-between">
                        <span className="text-base font-semibold text-slate-800 dark:text-white">
                            Total
                        </span>
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            {formatPrice(payable)}
                        </span>
                    </div>
                </div>

                {selectedCustomer?.is_loyalty_member && (
                    <>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Redeem Poin
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={redeemPointsInput}
                                onChange={(e) =>
                                    onRedeemPointsChange?.(e.target.value.replace(/[^\d]/g, ""))
                                }
                                placeholder={`Maks ${availablePoints} poin`}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-800 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Saldo tersedia: {availablePoints} poin
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Voucher Customer
                            </label>
                            <select
                                value={selectedVoucherId}
                                onChange={(e) => onVoucherChange?.(e.target.value)}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-800 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Tanpa voucher</option>
                                {voucherOptions.map((voucher) => (
                                    <option key={voucher.id} value={voucher.id}>
                                        {voucher.code} - {voucher.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Discount Input */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Diskon (Rp)
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={discountInput}
                        onChange={(e) => onDiscountChange(e.target.value.replace(/[^\d]/g, ""))}
                        placeholder="0"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-800 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    />
                </div>

                {/* Payment Method */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Metode Pembayaran
                    </label>
                    <div className="space-y-2">
                        {paymentOptions.map((method) => (
                            <PaymentMethodCard
                                key={method.value}
                                method={method}
                                isSelected={paymentMethod === method.value}
                                onClick={onPaymentMethodChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Bank Selector (only for bank_transfer) */}
                {paymentMethod === "bank_transfer" && bankAccounts.length > 0 && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Pilih Rekening Tujuan
                        </label>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {bankAccounts.map((bank) => {
                                const isActive = selectedBankAccount?.id === bank.id;
                                return (
                                    <button
                                        type="button"
                                        key={bank.id}
                                        onClick={() => onBankAccountChange?.(bank)}
                                        className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
                                            isActive
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                                                : "border-slate-200 hover:border-primary-200 dark:border-slate-700 dark:hover:border-primary-800"
                                        }`}
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                            {bank.logo_url ? (
                                                <img
                                                    src={bank.logo_url}
                                                    alt={bank.bank_name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <IconBuildingBank
                                                    size={22}
                                                    className="text-slate-500"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                {bank.bank_name}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {bank.account_number}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                                a.n. {bank.account_name}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <span className="text-xs font-semibold text-primary-600">
                                                Dipilih
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Cash Input (only for cash payment) */}
                {isCashPayment && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Jumlah Bayar (Rp)
                        </label>

                        {/* Quick Amounts */}
                        <div className="mb-3 flex gap-2">
                            {quickAmounts.map((amount) => (
                                <QuickAmountButton
                                    key={amount}
                                    amount={amount}
                                    onClick={(a) => onCashChange(String(a))}
                                    isSelected={cash === amount}
                                />
                            ))}
                        </div>

                        {/* Cash Input */}
                        <input
                            type="text"
                            inputMode="numeric"
                            value={cashInput}
                            onChange={(e) => onCashChange(e.target.value.replace(/[^\d]/g, ""))}
                            placeholder="0"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-lg font-semibold text-slate-800 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        />

                        {/* Change Display */}
                        <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Kembalian
                                </span>
                                <span
                                    className={`text-lg font-bold ${
                                        change > 0 ? "text-success-500" : "text-slate-400"
                                    }`}
                                >
                                    {formatPrice(change)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Non-cash payment info */}
                {!isCashPayment && (
                    <div className="rounded-xl border border-warning-200 bg-warning-50 p-3 dark:border-warning-800 dark:bg-warning-950/30">
                        <div className="flex gap-2">
                            <IconAlertCircle
                                size={18}
                                className="mt-0.5 flex-shrink-0 text-warning-500"
                            />
                            <p className="text-sm text-warning-700 dark:text-warning-400">
                                Tautan pembayaran akan muncul di halaman invoice setelah transaksi
                                dibuat.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all duration-200 ${
                        canSubmit
                            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98]"
                            : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                    } `}
                >
                    {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <>
                            <span>{submitLabel}</span>
                            {canSubmit && <IconArrowRight size={20} />}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// Export sub-components
PaymentPanel.QuickAmountButton = QuickAmountButton;
PaymentPanel.PaymentMethodCard = PaymentMethodCard;
