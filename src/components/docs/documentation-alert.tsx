/* oxlint-disable react/only-export-components -- the shared feedback hook is intentionally colocated with its renderer. */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { Alert, type AlertProps } from "@/components/ui/alert"

import "./documentation-alert.css"

type DocumentationAlertTone = NonNullable<AlertProps["tone"]>

type DocumentationAlertNotice = {
  id: number
  title: ReactNode
  description?: ReactNode
  tone: DocumentationAlertTone
}

type DocumentationAlertProps = {
  notice: DocumentationAlertNotice | null
  onDismiss: () => void
}

type DocumentationAlertStyle = CSSProperties & {
  "--documentation-alert-duration": string
}

const documentationAlertDuration = 1800

function useDocumentationAlert() {
  const sequence = useRef(0)
  const [notice, setNotice] = useState<DocumentationAlertNotice | null>(null)

  const showAlert = useCallback((
    title: ReactNode,
    tone: DocumentationAlertTone = "info",
    description?: ReactNode,
  ) => {
    sequence.current += 1
    setNotice({ id: sequence.current, title, description, tone })
  }, [])

  const dismissAlert = useCallback(() => setNotice(null), [])

  return { notice, showAlert, dismissAlert }
}

function DocumentationAlert({ notice, onDismiss }: DocumentationAlertProps) {
  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(onDismiss, documentationAlertDuration)
    return () => window.clearTimeout(timeout)
  }, [notice, onDismiss])

  if (!notice) return null

  const style: DocumentationAlertStyle = {
    "--documentation-alert-duration": `${documentationAlertDuration}ms`,
  }

  return (
    <div className="documentation-alert" key={notice.id} style={style}>
      <Alert
        className="documentation-alert-instance"
        tone={notice.tone}
        title={notice.title}
        description={notice.description}
      />
    </div>
  )
}

export {
  DocumentationAlert,
  useDocumentationAlert,
  type DocumentationAlertNotice,
  type DocumentationAlertTone,
}
