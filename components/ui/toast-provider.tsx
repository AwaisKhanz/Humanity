"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#fff",
          color: "#333",
          border: "1px solid #eee",
          padding: "16px",
          borderRadius: "8px",
        },
        success: {
          style: {
            border: "1px solid #10b981",
            borderLeft: "4px solid #10b981",
          },
        },
        error: {
          style: {
            border: "1px solid #ef4444",
            borderLeft: "4px solid #ef4444",
          },
        },
      }}
    />
  )
}
