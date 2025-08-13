import { useEffect } from "react";
import { generateId } from "../../../shared/lib/id"
import { getUserFromRepo, saveUserFromRepo } from "../api/user-repository";
import { useUserStore } from "./user-store";

export const useUser = () => {
  const { user, setUser } = useUserStore()

  const createUser = (displayName: string) => {
    const newUser = {
      id: generateId(),
      displayName,
    }

    setUser(newUser);
    saveUserFromRepo(newUser);
  }

  useEffect(() => {
    const localUser = getUserFromRepo();
    setUser(localUser);
  }, [])

  return { user, createUser }
}