import { useRef } from "react";

type GetSetRef = [get: () => any, set: (newValue: any, path?: string) => void];

export default function useRefValue(initialValue: any): GetSetRef {
  const ref = useRef(initialValue);

  const get = () => {
    // console.log("REF", ref.current);
    return ref.current;
  };

  const set = (newValue: any, path?: string) => {
    // console.log("REF", ref.current);
    if (!path) {
      ref.current = newValue;
      return;
    }

    const keys = path.split(".");
    let current: any = ref.current;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (
        !(key in current) ||
        typeof current[key] !== "object" ||
        current[key] === null
      ) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = newValue;
  };

  return [get, set];
}
