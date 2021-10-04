import { signOut, User } from "firebase/auth";

import { auth } from "common/utils/firebase.util";
import { removeUserStorage } from "./user-storage.util";

export interface UserData {
  id: string;
  displayName: string;
  email: string;
  token: string;
}

export const mapUserData = async (user: User): Promise<UserData | false> => {
  const { uid, displayName, email } = user;

  if (!displayName || !email) {
    // log user out if user has no name or email
    console.error("User has no display name or email. Signing out...");

    removeUserStorage();
    await signOut(auth);
    
    return false;
  }

  const token = await user.getIdToken(true);

  return {
    id: uid,
    displayName,
    email,
    token,
  };
};
