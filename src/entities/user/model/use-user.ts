import { useEffect } from "react";
import { generateId } from "../../../shared/lib/id"
import { getUserFromRepo, saveUserFromRepo } from "../api/user-repository";
import { useUserStore } from "./user-store";

export const useUser = () => {
  const { user, setUser } = useUserStore()

  const saveUser = (displayName: string, pictureUrl: string, idForNewUser?: string) => {
    const updatedUser = {
      id: user?.id ?? idForNewUser ?? generateId(),
      displayName,
      pictureUrl,
    }

    setUser(updatedUser);
    saveUserFromRepo(updatedUser);
  }

  useEffect(() => {
    const localUser = getUserFromRepo();
    setUser(localUser);
  }, [setUser])

  return { user, saveUser }
}