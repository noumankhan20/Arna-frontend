// src/components/checkout/CheckoutContent.jsx
"use client";

import { useCart } from "@/components/cart/CartContext";
import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, CreditCard, ShoppingBag,
  ChevronDown, CheckCircle2, Lock, Truck, Pencil, Tag, X
} from "lucide-react";
import { useGetMeQuery, useUpdateAddressMutation, useAddAddressMutation, useUpdateMeMutation } from "@/redux/slices/authApislice";
import { useCreateOrderMutation, usePreviewOrderMutation } from "@/redux/slices/orderApiSlice";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry",
];

export default function CheckoutContent() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const { data, refetch } = useGetMeQuery();
  const [updateAddress] = useUpdateAddressMutation();
  const [addAddress] = useAddAddressMutation();
  const [updateMe] = useUpdateMeMutation();
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cashfree");
  const [shippingForm, setShippingForm] = useState({
    fullName: "", addressLine1: "", email: "", phoneNo: "",
    addressLine2: "", city: "", state: "", postalCode: "",
    country: "India", addressType: "home",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(true);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [previewOrder, { data: pricingData, isLoading: isPreviewLoading, isError: isPreviewError, error: previewError }] =
    usePreviewOrderMutation();

  // Ref to scroll save button into view on mobile
  const saveButtonRef = useRef(null);
  const shippingCardRef = useRef(null);

  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      if (user.addresses?.length > 0) {
        const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setCurrentAddressId(defaultAddress._id);
        setShippingForm({
          fullName: user.name || "", email: user.email || "", phoneNo: user.phoneNo || "",
          addressLine1: defaultAddress.houseNo || "", addressLine2: defaultAddress.area || "",
          city: defaultAddress.city || "", state: defaultAddress.state || "",
          postalCode: defaultAddress.pincode || "", country: "India",
          addressType: defaultAddress.addressType || "home",
        });
        setIsEditingAddress(false);
      } else {
        setShippingForm((prev) => ({
          ...prev, fullName: user.name || "", email: user.email || "", phoneNo: user.phoneNo || "",
        }));
      }
    }
  }, [data]);

  // Scroll save button into view when editing starts on mobile
  useEffect(() => {
    if (isEditingAddress && saveButtonRef.current) {
      setTimeout(() => {
        saveButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 150);
    }
  }, [isEditingAddress]);

  const localPricing = useMemo(() => {
    const subtotal = +cartItems.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
    const shippingCharge = 150;
    const taxableAmount = +(subtotal + shippingCharge).toFixed(2);
    const cgst = +(taxableAmount * 0.045).toFixed(2);
    const sgst = +(taxableAmount * 0.045).toFixed(2);
    const gstTotal = +(cgst + sgst).toFixed(2);
    const totalAmount = +(taxableAmount + gstTotal).toFixed(2);
    return { subtotal, shippingCharge, taxableAmount, cgst, sgst, gstTotal, totalAmount };
  }, [cartItems]);

  const displayPricing = pricingData ?? localPricing;
  const isEstimate = !pricingData;

  useEffect(() => {
    if (!currentAddressId || cartItems.length === 0) return;
    previewOrder({
      items: cartItems.map((i) => ({ productId: i.id, quantity: i.qty })),
      addressId: currentAddressId,
      promoCode: appliedPromo || undefined,
    });
  }, [currentAddressId, cartItems, appliedPromo, previewOrder]);

  const handlePayNow = async () => {
    try {
      if (!currentAddressId) { alert("Please save your address first"); return; }
      if (cartItems.length === 0) { alert("Cart is empty"); return; }
      const response = await createOrder({
        items: cartItems.map((i) => ({ productId: i.id, quantity: i.qty })),
        addressId: currentAddressId, paymentMethod, promoCode: appliedPromo || undefined,
      }).unwrap();
      if (paymentMethod === "cashfree") {
        if (!response.paymentSessionId) { alert("Payment session not created"); return; }
        router.push(`/payment?sessionId=${response.paymentSessionId}&orderId=${response.orderId}`);
      }
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/order-success?orderId=${response.orderId}`);
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong");
    }
  };

  const handleShippingChange = (field, value) =>
    setShippingForm((prev) => ({ ...prev, [field]: value }));

  const handleSaveAddress = async () => {
    // Safety reset to avoid stuck isSaving state on mobile
    if (isSaving) return;
    try {
      setIsSaving(true);
      const addressPayload = {
        houseNo: shippingForm.addressLine1, area: shippingForm.addressLine2,
        city: shippingForm.city, state: shippingForm.state,
        pincode: shippingForm.postalCode, addressType: shippingForm.addressType, isDefault: true,
      };
      if (currentAddressId) {
        await updateAddress({ id: currentAddressId, ...addressPayload }).unwrap();
      } else {
        const res = await addAddress(addressPayload).unwrap();
        const newAddr = res.addresses[res.addresses.length - 1];
        setCurrentAddressId(newAddr._id);
      }
      const profilePayload = { name: shippingForm.fullName, phoneNo: shippingForm.phoneNo };
      if (data?.user?.authProvider !== "google") profilePayload.email = shippingForm.email;
      await updateMe(profilePayload).unwrap();
      await refetch();
      setIsEditingAddress(false);
    } catch (err) {
      alert("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressTypeChange = (type) => {
    const found = data?.user?.addresses?.find((a) => a.addressType === type);
    if (found) {
      setCurrentAddressId(found._id);
      setShippingForm({
        fullName: data.user.name || "", email: data.user.email || "", phoneNo: data.user.phoneNo || "",
        addressLine1: found.houseNo || "", addressLine2: found.area || "",
        city: found.city || "", state: found.state || "",
        postalCode: found.pincode || "", country: "India", addressType: found.addressType,
      });
    } else {
      setCurrentAddressId(null);
      setShippingForm((prev) => ({
        ...prev, addressType: type,
        addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "",
      }));
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    if (!currentAddressId) {
      alert("Please save address first");
      return;
    }

    try {
      await previewOrder({
        items: cartItems.map((i) => ({ productId: i.id, quantity: i.qty })),
        addressId: currentAddressId,
        promoCode,
      }).unwrap();

      setAppliedPromo(promoCode);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setAppliedPromo(null);
    if (currentAddressId && cartItems.length > 0) {
      previewOrder({
        items: cartItems.map((i) => ({ productId: i.id, quantity: i.qty })),
        addressId: currentAddressId,
      });
    }
  };

  useEffect(() => {
    setAppliedPromo(null);
  }, [cartItems]);

  const inp = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1";
  const addressIsComplete = !isEditingAddress && currentAddressId;
  const canPay =
    addressIsComplete &&
    !isLoading &&
    !isPreviewLoading &&
    !!pricingData &&
    !isPreviewError;
  const promoApplied = pricingData?.discount > 0;

  return (
    <>
      <style>{`
        .co-page { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .co-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        /* Fix: allow overflow visible when editing so keyboard + scroll works on mobile */
        .co-card.editing {
          overflow: visible;
        }
        .co-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #f3f4f6;
        }
        .co-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .addr-pill {
          flex: 1; padding: 7px 8px;
          border-radius: 8px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
          cursor: pointer; text-align: center; transition: all 0.15s;
          /* Fix: ensure tap target is large enough on mobile */
          min-height: 38px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .addr-pill.active { border-color: #10b981; background: #f0fdf4; color: #059669; }
        .pay-opt {
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          padding: 12px 14px; cursor: pointer;
          transition: all 0.18s; background: #fff; margin-bottom: 8px;
          /* Fix: better tap handling on mobile */
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .pay-opt.active { border-color: #10b981; background: #f7fdf9; }
        .rdot {
          width: 17px; height: 17px; border-radius: 50%;
          border: 2px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: border-color 0.15s;
        }
        .rdot.on { border-color: #10b981; }
        .rdot .d { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }
        .prow { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
        .pay-btn {
          width: 100%; padding: 13px;
          border-radius: 11px; font-size: 14px; font-weight: 700;
          color: #fff; border: none; cursor: pointer;
          position: relative; overflow: hidden;
          transition: all 0.18s; margin-top: 14px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          /* Fix: ensure tappable on iOS */
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          min-height: 48px;
        }
        .pay-btn.on { background: #059669; }
        .pay-btn.on:hover { background: #047857; box-shadow: 0 6px 20px rgba(5,150,105,0.28); transform: translateY(-1px); }
        .pay-btn.on:active { transform: translateY(0); }
        .pay-btn.off { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
        .pay-btn .sh {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%);
          transform: translateX(-100%); transition: transform 0.55s ease;
        }
        .pay-btn.on:hover .sh { transform: translateX(100%); }
        .step-bar { flex: 1; height: 1px; background: #e5e7eb; margin: 0 6px; }
        .step-bar.done { background: #10b981; }
        .promo-input {
          flex: 1;
          padding: 9px 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }
        .promo-input::placeholder { font-weight: 400; letter-spacing: 0; color: #9ca3af; font-size: 13px; }
        .promo-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .promo-input.applied { border-color: #10b981; background: #f0fdf4; color: #065f46; }
        .promo-apply-btn {
          padding: 9px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          /* Fix: tappable on iOS */
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          min-height: 40px;
        }
        .promo-apply-btn.idle { background: #111827; color: #fff; }
        .promo-apply-btn.idle:hover { background: #1f2937; }
        .promo-apply-btn.loading { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
        .promo-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f0fdf4;
          border: 1px solid #a7f3d0;
          border-radius: 6px;
          padding: 3px 8px 3px 6px;
          font-size: 11px;
          font-weight: 700;
          color: #065f46;
        }
        .promo-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 12px 0;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .promo-success { animation: fadeSlideIn 0.2s ease; }

        /* Fix: save button — large tap target, always visible above keyboard on mobile */
        .save-addr-btn {
          margin-top: 16px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          border: none;
          min-height: 52px;
          transition: all 0.18s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          cursor: pointer;
          /* Ensure it's always above the iOS keyboard */
          position: relative;
          z-index: 1;
        }
        .save-addr-btn.ready { background: #059669; }
        .save-addr-btn.ready:active { background: #047857; transform: scale(0.99); }
        .save-addr-btn.saving { background: #34d399; cursor: not-allowed; }
      `}</style>

      <div className="co-page min-h-screen bg-white">
        {/* Fix: pb-40 gives enough room on mobile so save button is never hidden behind nav bars */}
        <div className="max-w-lg mx-auto px-4 pt-14 sm:pt-20 pb-40">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Secure Checkout</p>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Complete your order</h1>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center mb-5">
            {[
              { label: "Shipping", n: 1, done: !!addressIsComplete },
              { label: "Payment", n: 2, done: false },
              { label: "Review", n: 3, done: false },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center" style={{ flex: i < 2 ? 1 : "none" }}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-content-center text-[11px] font-bold transition-all shrink-0
                    ${s.done ? "bg-emerald-500 text-white" : i === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.n}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${s.done ? "text-emerald-600" : i === 0 ? "text-gray-800" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className={`step-bar ${s.done ? "done" : ""}`} />}
              </div>
            ))}
          </div>

          {/* SHIPPING CARD */}
          {/* Fix: overflow visible when editing so the card doesn't clip the save button on mobile */}
          <div className={`co-card${isEditingAddress ? " editing" : ""}`} ref={shippingCardRef}>
            <div className="co-head">
              <div className="flex items-center gap-2.5">
                <div className={`co-icon ${addressIsComplete ? "bg-emerald-50" : "bg-gray-50"}`}>
                  <MapPin className={`w-4 h-4 ${addressIsComplete ? "text-emerald-500" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Shipping address</p>
                  {addressIsComplete && <p className="text-[10px] text-emerald-500 font-semibold">Saved ✓</p>}
                </div>
              </div>
              {!isEditingAddress && (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  {["home", "work", "other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`addr-pill ${shippingForm.addressType === t ? "active" : ""}`}
                      onClick={() => handleAddressTypeChange(t)}
                    >
                      {t === "home" ? "🏠 Home" : t === "work" ? "💼 Work" : "📍 Other"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={lbl}>Full Name</label>
                    <input type="text" value={shippingForm.fullName}
                      onChange={(e) => handleShippingChange("fullName", e.target.value)}
                      className={inp} placeholder="Your full name" autoComplete="shipping name" />
                  </div>
                  <div>
                    <label className={lbl}>Phone</label>
                    <input type="tel" value={shippingForm.phoneNo}
                      onChange={(e) => handleShippingChange("phoneNo", e.target.value)}
                      className={inp} placeholder="Phone number" />
                  </div>
                  <div>
                    <label className={lbl}>Email</label>
                    <input type="email" value={shippingForm.email}
                      onChange={(e) => handleShippingChange("email", e.target.value)}
                      disabled={data?.user?.authProvider === "google"}
                      className={`${inp} ${data?.user?.authProvider === "google" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`} />
                    {data?.user?.authProvider === "google" && (
                      <p className="text-[10px] text-gray-400 mt-0.5">Google account — cannot edit.</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>House / Flat / Office</label>
                    <input type="text" value={shippingForm.addressLine1}
                      onChange={(e) => handleShippingChange("addressLine1", e.target.value)}
                      className={inp} placeholder="Building, house number" autoComplete="shipping street-address" />
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>Area / Colony / Street</label>
                    <input type="text" value={shippingForm.addressLine2}
                      onChange={(e) => handleShippingChange("addressLine2", e.target.value)}
                      className={inp} placeholder="Landmark, area" autoComplete="shipping address-line2" />
                  </div>
                  <div>
                    <label className={lbl}>City</label>
                    <input type="text" value={shippingForm.city}
                      onChange={(e) => handleShippingChange("city", e.target.value)}
                      className={inp} placeholder="City" />
                  </div>
                  <div>
                    <label className={lbl}>PIN Code</label>
                    <input type="text" inputMode="numeric" maxLength={6}
                      value={shippingForm.postalCode}
                      onChange={(e) => handleShippingChange("postalCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className={inp} placeholder="6-digit PIN" />
                  </div>
                  <div>
                    <label className={lbl}>State</label>
                    <div className="relative">
                      <select value={shippingForm.state}
                        onChange={(e) => handleShippingChange("state", e.target.value)}
                        className={`${inp} appearance-none pr-8`}>
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Country</label>
                    <input type="text" value={shippingForm.country}
                      onChange={(e) => handleShippingChange("country", e.target.value)}
                      className={`${inp} bg-gray-50`} />
                  </div>
                </div>

                {/* Fix: save button with ref for scrollIntoView, type="button" prevents any form submit,
                    large min-height for easy tap, touch-action manipulation for instant response on iOS */}
                <button
                  ref={saveButtonRef}
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveAddress}
                  className={`save-addr-btn ${isSaving ? "saving" : "ready"}`}
                >
                  {isSaving
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                    : <><CheckCircle2 className="w-4 h-4" />Save &amp; Continue</>}
                </button>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{shippingForm.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{shippingForm.phoneNo} · {shippingForm.email}</p>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {shippingForm.addressLine1}{shippingForm.addressLine2 ? `, ${shippingForm.addressLine2}` : ""},{" "}
                      {shippingForm.city}, {shippingForm.state} — {shippingForm.postalCode}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md shrink-0 capitalize">
                    {shippingForm.addressType}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT CARD */}
          <div className="co-card">
            <div className="co-head">
              <div className="flex items-center gap-2.5">
                <div className="co-icon bg-gray-50">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Payment method</p>
                  <p className="text-[10px] text-gray-400">Encrypted &amp; secure</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              {/* Cashfree */}
              <div className={`pay-opt ${paymentMethod === "cashfree" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cashfree")}>
                <div className="flex items-center gap-3">
                  <div className={`rdot ${paymentMethod === "cashfree" ? "on" : ""}`}>
                    {paymentMethod === "cashfree" && <div className="d" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">Cashfree Secure</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">UPI · Cards · Wallets · International</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 bg-white">UPI</span>
                    <span className="text-[10px] font-bold text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 bg-blue-50">VISA</span>
                    <span className="text-[10px] font-bold text-red-500 border border-red-200 rounded px-1.5 py-0.5 bg-red-50">MC</span>
                  </div>
                </div>
                {paymentMethod === "cashfree" && (
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-100 flex items-center gap-2">
                    <div className="w-6 h-6 bg-white border border-emerald-200 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
                        <path d="M3 8h18" strokeWidth="2" />
                        <path d="M16 12h2" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      You&apos;ll be redirected to Cashfree to complete payment securely.
                    </p>
                  </div>
                )}
              </div>

              {/* COD Option */}
              {/* <div
                className={`pay-opt ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="flex items-center gap-3">
                  <div className={`rdot ${paymentMethod === "cod" ? "on" : ""}`}>
                    {paymentMethod === "cod" && <div className="d" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Pay with cash or card when the order is delivered.</p>
                  </div>
                </div>
              </div> */}

              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <Truck className="w-3 h-3 text-emerald-400" />Tracked Delivery
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY CARD */}
          <div className="co-card">
            <div className="co-head">
              <div className="flex items-center gap-2.5">
                <div className="co-icon bg-gray-50">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-900">Order summary</p>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                {cartItems.reduce((s, i) => s + i.qty, 0)} items
              </span>
            </div>

            {/* Cart items */}
            <div className="px-4 pt-3 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">₹{item.price.toFixed(2)} × {item.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="p-4">

              {/* ── PROMO CODE ── */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Promo code</span>
                </div>

                {promoApplied ? (
                  /* Applied state */
                  <div className="promo-success flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">
                          {pricingData?.appliedPromo?.promoCode ?? promoCode} applied
                        </p>
                        <p className="text-[10px] text-emerald-600 mt-0.5">
                          You save ₹{pricingData.discount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="w-6 h-6 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition"
                      style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                    >
                      <X className="w-3.5 h-3.5 text-emerald-700" />
                    </button>
                  </div>
                ) : (
                  /* Input state */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      disabled={promoApplied}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      className={`promo-input ${promoApplied ? "applied" : ""}`}
                    />

                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoCode || isPreviewLoading}
                      className={`promo-apply-btn ${!promoCode || isPreviewLoading ? "loading" : "idle"}`}
                    >
                      {isPreviewLoading ? "…" : "Apply"}
                    </button>
                  </div>

                )}
              </div>
              {previewError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  {previewError?.data?.message || "Invalid promo code"}
                </p>
              )}
              <div className="promo-divider" />

              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="prow">
                  <span className="text-xs text-gray-500">Subtotal</span>
                  <span className="text-xs font-semibold text-gray-800">₹{displayPricing.subtotal.toFixed(2)}</span>
                </div>

                {/* Promo discount row — only shown when discount > 0 */}
                {displayPricing.discount > 0 && (
                  <div className="prow promo-success">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-emerald-600 font-medium">Promo discount</span>
                      <span className="promo-tag">
                        <Tag className="w-2.5 h-2.5" />
                        {displayPricing.appliedPromo?.promoCode ?? promoCode}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">−₹{displayPricing.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="prow">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Shipping</span>
                    {isEstimate && <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-1 py-0.5 rounded">est.</span>}
                  </div>
                  <span className="text-xs font-semibold text-gray-800">₹{displayPricing.shippingCharge.toFixed(2)}</span>
                </div>
                <div className="prow">
                  <span className="text-xs text-gray-500">CGST (4.5%)</span>
                  <span className="text-xs text-gray-500">₹{displayPricing.cgst.toFixed(2)}</span>
                </div>
                <div className="prow">
                  <span className="text-xs text-gray-500">SGST (4.5%)</span>
                  <span className="text-xs text-gray-500">₹{displayPricing.sgst.toFixed(2)}</span>
                </div>
                <div className="prow">
                  <span className="text-xs text-gray-500">Total GST (9%)</span>
                  <span className="text-xs text-gray-500">₹{displayPricing.gstTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-2.5 mt-1 border-t border-gray-200">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Total payable</p>
                    {isEstimate && <p className="text-[9px] text-amber-500 font-medium">Save address to confirm</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">INR</p>
                    <p className="text-xl font-black text-gray-900">₹{displayPricing.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayNow}
                disabled={!canPay}
                className={`pay-btn ${canPay ? "on" : "off"}`}
              >
                <span className="sh" />
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                ) : isPreviewLoading ? (
                  <><span className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />Calculating…</>
                ) : !pricingData ? (
                  "Save address to continue"
                ) : (
                  <><Lock className="w-4 h-4" />Pay ₹{displayPricing.totalAmount.toFixed(2)} securely</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}