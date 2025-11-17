import { MyInfoResponse, MessageProps } from "@/types";
import { useState, useEffect } from "react";
import { getMyInfo } from "../services/api";

export default function useGetUserInfo() {
  const [userInfo, setUserInfo] = useState<MyInfoResponse | null>(null);
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const info = await getMyInfo();
        if (info) {
          setUserInfo(info);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessageInfo({
          message: "Ett fel uppstod vid hämtning av användarinformation.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);
  return { userInfo, messageInfo, loading };
}
