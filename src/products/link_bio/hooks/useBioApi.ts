import { useCallback, useEffect, useMemo, useState } from "react";
import { errMsg } from "@/shared/api/client";
import { bioClient } from "../services/bioApi";
import { useLinkBioContext } from "./useLinkBioContext";

export const useBioApi = () => {
  const { organization_id } = useLinkBioContext();
  return useMemo(() => bioClient(organization_id), [organization_id]);
};

export const useLoad = <T,>(loader: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    try { setData(await loader()); setError(""); } catch (e) { setError(errMsg(e)); }
  }, [loader]);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, reload, setData };
};
