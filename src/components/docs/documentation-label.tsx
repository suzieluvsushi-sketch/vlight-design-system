import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

function DocumentationLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("documentation-label", className)} {...props} />
}

export { DocumentationLabel }
