"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

// Define donation options - you can add more here
const DONATION_OPTIONS = [
  {
    id: 1,
    qrCode: "/litecoin-donate-qr-public.png",
    address: "ltc1qqke99thkt4nh8a8xe9ajw9zudxjvfhhl08cuwx",
    label: "", // Optional label for each option
  },
  {
    id: 2,
    qrCode: "/litecoin-donate-qr.png", // Replace with your second QR code path
    address: "ltcmweb1qq0qus56kqg3vq89g7lhn5zq5qreavp8fapu9whjvnsne6djqu500qqumgh5dx274sasj4067juaqdnvwvag2u4phjh409lvecl7cq5nmxccjz0sn", // Replace with your second address
    label: "- MWEB",
  },
]

export function DonateDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const currentOption = DONATION_OPTIONS[currentPage]

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(currentOption.address)
      setCopied(true)
      toast.success("Address copied to clipboard!", {
        description: "You can now paste it in your wallet",
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy address", {
        description: "Please try again or copy manually",
        duration: 3000,
      })
    }
  }

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? DONATION_OPTIONS.length - 1 : prev - 1))
    setCopied(false) // Reset copy state when changing pages
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev === DONATION_OPTIONS.length - 1 ? 0 : prev + 1))
    setCopied(false) // Reset copy state when changing pages
  }

  // Reset to first page when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setCurrentPage(0)
      setCopied(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Donate Litecoin</DialogTitle>
          <DialogDescription>
            This project runs on passion for Litecoin. Please help us keep it alive by donating whatever you can. Your support means the world to us ❤️
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code */}
          <div className="flex items-center justify-center rounded-lg border bg-background p-4">
            <Image
              src={currentOption.qrCode}
              alt={`Litecoin Donation QR Code - ${currentOption.label}`}
              width={256}
              height={256}
              className="rounded-lg"
            />
          </div>

          {/* Page Navigation */}
          {DONATION_OPTIONS.length > 1 && (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                {DONATION_OPTIONS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentPage
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentPage + 1} / {DONATION_OPTIONS.length}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Address */}
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Litecoin Address {DONATION_OPTIONS.length > 1 && `${currentOption.label}`}
            </label>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
              <code className="flex-1 break-all text-sm font-mono text-foreground">
                {currentOption.address}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

