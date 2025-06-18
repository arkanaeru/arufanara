'use client';
import { Suspense } from "react";
import OrderDetailContent from "./OrderDetailContent";

export default function OrderDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
        <div className="text-lg text-white">Memuat detail pesanan...</div>
      </div>
    }>
      <OrderDetailContent />
    </Suspense>
  );
}