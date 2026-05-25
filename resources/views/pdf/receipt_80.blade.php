@php
    $formatPrice = fn($v) => 'Rp ' . number_format($v ?? 0, 0, ',', '.');
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        @page { 
            margin: 0; 
        }
        body { 
            font-family: 'Courier New', Courier, monospace; 
            margin: 0; 
            padding: 6px 8px; 
            font-size: 11px; 
            line-height: 1.3; 
            color: #000; 
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .barcode { 
            text-align: center; 
            margin: 8px 0; 
        }
        .barcode img { 
            height: 32px; 
            display: inline-block; 
        }
        .section { margin: 4px 0; }
        .line-double { 
            border-top: 3px double #000; 
            margin: 6px 0; 
        }
        .line-dashed { 
            border-top: 1px dashed #000; 
            margin: 6px 0; 
        }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 1.5px 0; vertical-align: top; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <div class="center section" style="margin-top:0;">
        <div class="bold" style="font-size: 13px; margin-bottom: 2px;">{{ $store['name'] }}</div>
        @if($store['address'])<div style="font-size: 10px;">{{ $store['address'] }}</div>@endif
        @if($store['phone'])<div style="font-size: 10px;">Telp: {{ $store['phone'] }}</div>@endif
        @if($store['email'])<div style="font-size: 10px;">Email: {{ $store['email'] }}</div>@endif
        @if($store['website'])<div style="font-size: 10px;">{{ $store['website'] }}</div>@endif
    </div>

    <div class="line-double"></div>

    <div class="section">
        <table>
            <tr>
                <td style="width: 30%;">No:</td>
                <td class="text-right">{{ $transaction->invoice }}</td>
            </tr>
            <tr>
                <td>Tgl:</td>
                <td class="text-right">{{ \Carbon\Carbon::parse($transaction->created_at)->format('d/m/Y H:i') }}</td>
            </tr>
            <tr>
                <td>Kasir:</td>
                <td class="text-right">{{ $transaction->cashier->name ?? '-' }}</td>
            </tr>
            <tr>
                <td>Pelanggan:</td>
                <td class="text-right">{{ $transaction->customer->name ?? 'Umum' }}</td>
            </tr>
        </table>
    </div>

    <div class="line-double"></div>

    <div class="section">
        @foreach($transaction->details as $item)
            @php
                $qty = max(1, $item->qty);
                $total = $item->price;
                $unit = $item->unit_price ?: ($qty ? $total / $qty : $total);
            @endphp
            <div class="bold">{{ $item->product->title ?? 'Produk' }}</div>
            @if($item->discount_total > 0 && ($item->pricing_group_label || $item->pricing_rule_name))
                <table>
                    <tr style="font-size: 9px; color: #555;">
                        <td>Promo: {{ $item->pricing_group_label ?: $item->pricing_rule_name }}</td>
                        <td class="text-right">{{ $formatPrice($item->base_unit_price) }}</td>
                    </tr>
                </table>
            @endif
            <table>
                <tr>
                    <td style="width: 50%;">{{ $qty }}x @ {{ $formatPrice($unit) }}</td>
                    <td class="text-right">{{ $formatPrice($total) }}</td>
                </tr>
            </table>
        @endforeach
    </div>

    <div class="line-dashed"></div>

    @php
        $promoDiscount = $transaction->details->sum('discount_total');
        $voucherDiscount = $transaction->customer_voucher_discount ?? 0;
        $loyaltyDiscount = $transaction->loyalty_discount_total ?? 0;
        $subtotal = ($transaction->grand_total ?? 0) + ($transaction->discount ?? 0) - ($transaction->shipping_cost ?? 0) + $promoDiscount + $voucherDiscount + $loyaltyDiscount;
        $discount = $transaction->discount ?? 0;
        $total = $transaction->grand_total ?? 0;
        $shipping = $transaction->shipping_cost ?? 0;
        $cash = $transaction->cash ?? 0;
        $change = $transaction->change ?? 0;
        $paymentMethod = strtoupper($transaction->payment_method ?? 'TUNAI');
    @endphp

    <div class="section">
        <table>
            <tr>
                <td>Subtotal</td>
                <td class="text-right">{{ $formatPrice($subtotal) }}</td>
            </tr>
            @if($promoDiscount > 0)
                <tr>
                    <td>Promo</td>
                    <td class="text-right">-{{ $formatPrice($promoDiscount) }}</td>
                </tr>
            @endif
            @if($discount > 0)
                <tr>
                    <td>Diskon Manual</td>
                    <td class="text-right">-{{ $formatPrice($discount) }}</td>
                </tr>
            @endif
            @if($voucherDiscount > 0)
                <tr>
                    <td>Voucher</td>
                    <td class="text-right">-{{ $formatPrice($voucherDiscount) }}</td>
                </tr>
            @endif
            @if($loyaltyDiscount > 0)
                <tr>
                    <td>Redeem Poin</td>
                    <td class="text-right">-{{ $formatPrice($loyaltyDiscount) }}</td>
                </tr>
            @endif
            @if($shipping > 0)
                <tr>
                    <td>Ongkir</td>
                    <td class="text-right">{{ $formatPrice($shipping) }}</td>
                </tr>
            @endif
            <tr class="bold" style="font-size: 12px;">
                <td>TOTAL</td>
                <td class="text-right">{{ $formatPrice($total) }}</td>
            </tr>
        </table>
    </div>

    <div class="line-dashed"></div>

    <div class="section">
        <table>
            <tr>
                <td>Bayar ({{ $paymentMethod }})</td>
                <td class="text-right">{{ $formatPrice($cash) }}</td>
            </tr>
            @if($change > 0)
                <tr class="bold">
                    <td>Kembali</td>
                    <td class="text-right">{{ $formatPrice($change) }}</td>
                </tr>
            @endif
        </table>
    </div>

    <div class="line-double"></div>

    <div class="center section" style="margin-bottom:0;">
        <div class="barcode">
            <img src="{{ $barcode }}" alt="barcode">
        </div>
        <div style="font-size: 9px; font-weight: bold; margin-bottom: 4px;">{{ $transaction->invoice }}</div>
        <div>Terima kasih!</div>
    </div>
</body>
</html>
