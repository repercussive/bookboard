import { MutableRefObject, useLayoutEffect, useState } from 'react'
import debounce from 'lodash/debounce'

function getElementDimensions(elementRef: MutableRefObject<HTMLElement>) {
  return {
    width: elementRef.current?.offsetWidth ?? 0,
    height: elementRef.current?.offsetHeight ?? 0
  }
}

export default function useElementDimensions(elementRef: MutableRefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState(getElementDimensions(elementRef))

  useLayoutEffect(() => {
    const handleResize = () => setDimensions(getElementDimensions(elementRef))
    const handleResizeDebounced = debounce(handleResize, 300)
    handleResize()
    window.addEventListener('resize', handleResizeDebounced)
    return () => window.removeEventListener('resize', handleResizeDebounced)
  }, [elementRef])

  return dimensions
}