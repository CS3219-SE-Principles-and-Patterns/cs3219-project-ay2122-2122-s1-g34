import { UserData } from "features/auth/map-user-data.util";

export const getUserFromStorage = (): UserData | undefined => {
  const user = localStorage.getItem("auth");
  if (!user) {
    return;
  }
  return JSON.parse(user);
};

export const setUserStorage = (user: UserData | false) => {
  if (!user) {
    removeUserStorage();
  } else {
    localStorage.setItem("auth", JSON.stringify(user));
  }
};

export const removeUserStorage = () => localStorage.removeItem("auth");
