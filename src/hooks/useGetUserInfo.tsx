import { MyInfoResponse, MessageProps } from "@/types";
import { useState, useEffect } from "react";
import { getMyInfo } from "./api";

export default function useGetUserInfo() {
  const [userInfo, setUserInfo] = useState<MyInfoResponse | null>(null);
  const [messageInfo, setMessageInfo] = useState<MessageProps | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
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
      }
    };
    fetchInfo();
  }, []);
  return { userInfo, messageInfo };
}
