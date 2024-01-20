import { useCallback } from "react";

export default function useBoost() {
  const getBoostClaimStatus = useCallback(
    (address: string, boostId: number) => {
      try {
        if (!address) return false;
        const res = localStorage.getItem("boostClaimStatus");
        if (!res) {
          return false;
        }
        const parsed = JSON.parse(res);
        return parsed[address][boostId] ?? false;
      } catch (err) {
        return false;
      }
    },
    []
  );

  const updateBoostClaimStatus = useCallback(
    (address: string, boostId: number, value: boolean) => {
      try {
        if (!address) return false;
        const res = localStorage.getItem("boostClaimStatus");
        const parsed = res ? JSON.parse(res) : {};
        parsed[address] = parsed[address] ?? {};
        parsed[address][boostId] = value;
        localStorage.setItem("boostClaimStatus", JSON.stringify(parsed));
      } catch (err) {
        return false;
      }
    },
    []
  );

  return { getBoostClaimStatus, updateBoostClaimStatus };
}
