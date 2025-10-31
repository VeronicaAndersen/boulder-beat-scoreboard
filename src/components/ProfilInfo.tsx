import { getMyInfo } from "@/hooks/api";
import { MyInfoResponse } from "@/types";
import { useEffect, useState } from "react";

export default function ProfilInfo() {
  const [info, setInfo] = useState<MyInfoResponse | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await getMyInfo();
      setInfo(data);
    };
    fetchInfo();
  }, []);

  return (
    <div>
      {info ? (
        <div>
          <p>ID: {info.id}</p>
          <p>Namn: {info.name}</p>
        </div>
      ) : (
        <p>Ingen information tillgänglig.</p>
      )}
    </div>
  );
}
