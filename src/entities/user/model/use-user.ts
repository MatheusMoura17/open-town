import { useEffect } from "react";
import { generateId } from "../../../shared/lib/id"
import { getUser, saveUser } from "../api/user-repository";
import { useUserStore } from "./user-store";

export const useUser = () => {
  const { user, setUser } = useUserStore()

  const createUser = (displayName: string) => {
    const newUser = {
      id: generateId(),
      displayName,
    }

    setUser(newUser);
    saveUser(newUser);
  }

  useEffect(() => {
    const localUser = getUser();
    setUser(localUser);
  }, [])

  return { user, createUser }
}