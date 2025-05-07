import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // use the above hook
import { useRouter } from "next/navigation";

export default function useProtectedRoute() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);
  return user;
}
