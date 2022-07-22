import { useRef, useEffect } from 'react';
const useDidUpdate = (func: () => void, deps: Array<any>) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidUpdate;
