/* eslint-disable @typescript-eslint/naming-convention */
import { MutableRefObject, useRef, useState } from 'react';

export default function useRefState<T>(value: T): [T, (v: T) => void, MutableRefObject<T>] {
  const [val, _setVal] = useState<T>(value);
  const valRef = useRef<T>(val);

  const setVal = (newVal: T) => {
    valRef.current = newVal;
    _setVal(newVal);
  };

  return [val, setVal, valRef];
}
