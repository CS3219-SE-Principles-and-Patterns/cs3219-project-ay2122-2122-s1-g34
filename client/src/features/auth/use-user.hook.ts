import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { useAppDispatch } from "common/hooks/use-redux.hook";
import { auth } from "common/utils/firebase.util";

import { mapUserData } from "features/auth/map-user-data.util";
import { getUserFromStorage } from "features/auth/user-storage.util";
import { logout, setUserData } from "features/auth/user.slice";

export function useUser() {
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cancelAuthListener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await mapUserData(user);
        dispatch(setUserData(userData));
      } else {
        dispatch(logout());
      }
    });

    const userFromStorage = getUserFromStorage();
    if (userFromStorage) {
      dispatch(setUserData(userFromStorage));
    }

    setIsLoaded(true);

    return () => {
      cancelAuthListener();
    };
  }, [dispatch]);

  return isLoaded;
}
