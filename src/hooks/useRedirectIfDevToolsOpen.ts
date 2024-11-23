import { isDevToolsOpen } from "@/utility/isDevToolsOpen";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectIfDevToolsOpen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkDevTools = () => {
      if (isDevToolsOpen()) {
        navigate("/"); // Redirect to root
      }
    };

    const interval = setInterval(checkDevTools, 1000); // Periodic check

    return () => clearInterval(interval); // Cleanup
  }, [navigate]);
};
