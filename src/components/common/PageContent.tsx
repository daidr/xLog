"use client"

import { MutableRefObject, useEffect, useMemo } from "react"

import { PostActions } from "~/components/site/PostActions"
import { PostToc } from "~/components/site/PostToc"
import { useCodeCopy } from "~/hooks/useCodeCopy"
import { ExpandedCharacter, ExpandedNote } from "~/lib/types"
import { calculateElementTop, cn } from "~/lib/utils"
import { renderPageContent } from "~/markdown"

export const PageContent: React.FC<{
  content?: string
  className?: string
  toc?: boolean
  inputRef?: MutableRefObject<HTMLDivElement | null>
  onScroll?: (scrollTop: number) => void
  onMouseEnter?: () => void
  parsedContent?: ReturnType<typeof renderPageContent>
  isComment?: boolean
  page?: ExpandedNote
  site?: ExpandedCharacter
  withActions?: boolean
}> = ({
  className,
  content,
  toc,
  inputRef,
  onScroll,
  onMouseEnter,
  parsedContent,
  isComment,
  page,
  site,
  withActions,
}) => {
  useCodeCopy()

  const inParsedContent = useMemo(() => {
    if (parsedContent) {
      return parsedContent
    } else if (content) {
      const result = renderPageContent(content, false, isComment)
      return result
    } else {
      return null
    }
  }, [content, isComment, parsedContent])

  useEffect(() => {
    const hashChangeHandler = () => {
      const hash = decodeURIComponent(location.hash.slice(1))
      if (hash) {
        if (history.state?.preventScrollToToc) {
          history.state.preventScrollToToc = false
          return
        }
        const targetElement = document.querySelector(
          `#user-content-${decodeURIComponent(hash)}`,
        ) as HTMLElement
        if (!targetElement) return

        window.scrollTo({
          top: calculateElementTop(targetElement) - 20,
          behavior: "smooth",
        })
      }
    }

    window.addEventListener("hashchange", hashChangeHandler)
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler)
    }
  }, [])

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={onMouseEnter}
      onScroll={(e) => onScroll?.((e.target as any)?.scrollTop)}
    >
      <div className="xlog-post-content prose" ref={inputRef}>
        {inParsedContent?.element}
      </div>
      {toc && inParsedContent?.toc && <PostToc data={inParsedContent?.toc} />}
      {withActions && <PostActions page={page} site={site} />}
    </div>
  )
}
