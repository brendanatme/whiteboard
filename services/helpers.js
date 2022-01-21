// https://stackoverflow.com/questions/54095994/react-useeffect-comparing-objects
import { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

function deepCompareEquals(a, b) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef() 
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function useDeepCompareEffect(callback, dependencies) {
  useEffect(
    callback,
    dependencies.map(useDeepCompareMemoize)
  )
}