"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2 } from "lucide-react"

interface ReportIssueDialogProps {
  tableType: "companies" | "etfs"
  trigger: React.ReactNode
}

export function ReportIssueDialog({ tableType, trigger }: ReportIssueDialogProps) {
  const [open, setOpen] = useState(false)
  const [issue, setIssue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)

  const handleSubmit = async () => {
    if (!issue.trim()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue: issue.trim(),
          tableType: tableType,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setIssue("")
        // Close dialog after 1.5 seconds
        setTimeout(() => {
          setOpen(false)
          setSubmitStatus(null)
        }, 1500)
      } else {
        setSubmitStatus("error")
        console.error("Error submitting issue:", result.error)
      }
    } catch (error) {
      setSubmitStatus("error")
      console.error("Error submitting issue:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen)
      if (!newOpen) {
        // Reset form when dialog closes
        setIssue("")
        setSubmitStatus(null)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Inaccurate Data</DialogTitle>
          <DialogDescription>
            Please describe the inaccurate data you found in the {tableType === "companies" ? "Companies" : "ETFs"} table.
            We'll review your report and update the information accordingly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="issue" className="text-sm font-medium">
              Issue Description
            </label>
            <Textarea
              id="issue"
              placeholder="Please describe the inaccurate data, including which company/ETF and what information is incorrect..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              rows={6}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>
          {submitStatus === "success" && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-200">
              Thank you! Your report has been submitted successfully.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200">
              Failed to submit your report. Please try again later.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!issue.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

