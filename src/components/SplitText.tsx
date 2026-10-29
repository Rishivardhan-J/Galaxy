import { Fragment } from 'react'

// Masked letter-by-letter rise (600 ms, 20 ms stagger). Accessible name is the plain text.
export function SplitText({ text, delay = 90 }: { text: string; delay?: number }) {
  let i = 0
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w, all) => (
          <Fragment key={w}>
            <span style={{ whiteSpace: 'nowrap' }}>
              {[...word].map((c) => (
                <span key={i} className="split" style={{ ['--i' as string]: i++, ['--d' as string]: `${delay}ms` }}>
                  <span>{c}</span>
                </span>
              ))}
            </span>
            {w < all.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </>
  )
}
