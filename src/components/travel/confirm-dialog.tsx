import * as Dialog from "@radix-ui/react-dialog"
import { dangerBtn, quietBtn } from "@/components/travel/ui"

type Props = {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmDialog({ open, title, body, confirmLabel, onOpenChange, onConfirm }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-card p-5 shadow-lg">
          <Dialog.Title className="font-display text-2xl font-medium">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">{body}</Dialog.Description>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Dialog.Close type="button" className={quietBtn}>
              Cancel
            </Dialog.Close>
            <button
              type="button"
              className={dangerBtn}
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
