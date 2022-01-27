import { MutableRefObject, useLayoutEffect, useState } from 'react'
import debounce from 'lodash/debounce'

function getElementDimensions(elementRef: MutableRefObject<HTMLElement>) {
  return {
    width: elementRef.current?.offsetWidth ?? 0,
    height: elementRef.current?.offsetHeight ?? 0
  }
}

export default function useElementDimensions(elementRef: MutableRefObject<HTMLElement>, extraDependencies?: any[]) {
  const [dimensions, setDimensions] = useState(getElementDimensions(elementRef))

  const resize = () => setDimensions(getElementDimensions(elementRef))

  useLayoutEffect(() => {
    const resizeDebounced = debounce(resize, 300)
    resize()
    window.addEventListener('resize', resizeDebounced)
    return () => window.removeEventListener('resize', resizeDebounced)
  }, [elementRef])

  useLayoutEffect(() => {
    resize()
  }, [...(extraDependencies ?? [])])

  return dimensions
}