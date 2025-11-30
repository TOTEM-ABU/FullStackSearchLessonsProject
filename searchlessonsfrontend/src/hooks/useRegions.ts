import { useState, useEffect } from "react";
import { regionsAPI } from "../services/api";
import type { Region } from "../types";

interface UseRegionsReturn {
  regions: Region[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRegions = (): UseRegionsReturn => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await regionsAPI.getRegions({ limit: 100 });
      setRegions(response.data);
    } catch (err: unknown) {
      let errorMessage = "Regionlarni yuklashda xatolik yuz berdi";

      if (err && typeof err === "object") {
        if (
          "response" in err &&
          err.response &&
          typeof err.response === "object"
        ) {
          if (
            "data" in err.response &&
            err.response.data &&
            typeof err.response.data === "object"
          ) {
            if ("message" in err.response.data) {
              errorMessage = String(err.response.data.message);
            }
          }
        }
      }

      setError(errorMessage);
      console.error("Failed to fetch regions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return {
    regions,
    loading,
    error,
    refetch: fetchRegions,
  };
};
