import { useEffect, useState } from "react";

const KEY = "tv1-member-name";

export function useMemberName() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(window.localStorage.getItem(KEY) ?? "");
  }, []);

  function update(next: string) {
    setName(next);
    window.localStorage.setItem(KEY, next);
  }

  return [name, update] as const;
}
