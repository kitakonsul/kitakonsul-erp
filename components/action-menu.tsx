"use client"

import { useEffect, useRef, useState } from "react"
import { MoreHorizontal, Pencil, Play, Ban } from "lucide-react"

type ActionMenuProps = {
  label: string
  onEdit?: () => void
  onProcess?: () => void
  onReject?: () => void
}

export function ActionMenu({ label, onEdit, onProcess, onReject }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  function run(fn?: () => void) {
    fn?.()
    setOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${label}`}
        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Action
        <MoreHorizontal className="size-3.5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-md border border-border bg-popover py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => run(onEdit)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-popover-foreground transition-colors hover:bg-secondary"
          >
            <Pencil className="size-3.5 text-muted-foreground" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => run(onProcess)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-popover-foreground transition-colors hover:bg-secondary"
          >
            <Play className="size-3.5 text-primary" />
            Proses
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => run(onReject)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-destructive transition-colors hover:bg-destructive/10"
          >
            <Ban className="size-3.5" />
            Reject
          </button>
        </div>
      )}
    </div>
  )
}
