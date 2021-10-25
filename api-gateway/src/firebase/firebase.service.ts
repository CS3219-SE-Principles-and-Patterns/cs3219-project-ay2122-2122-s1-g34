import { Global, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Global()
@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp(
      process.env.NODE_ENV === "production"
        ? {
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              // https://stackoverflow.com/a/41044630/1332513
              privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
                /\\n/g,
                "\n"
              ),
            }),
          }
        : { projectId: process.env.FIREBASE_PROJECT_ID }
    );
  }

  /**
   * Verifies firebase JWT
   * @param token Firebase JWT token
   */
  verifyIdToken(token: string) {
    return admin.auth().verifyIdToken(token);
  }

  async createUser(properties: admin.auth.CreateRequest) {
    try {
      const userRecord = await admin.auth().createUser(properties);
      return userRecord;
    } catch (e) {
      if (e.code === "auth/email-already-exists") {
        throw new HttpException(
          { message: { email: e.message } },
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new HttpException(
          { message: "Internal Server Error" },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  getUserInformation(userId: string) {
    return admin.auth().getUser(userId);
  }

  createCustomToken(userId: string) {
    return admin.auth().createCustomToken(userId);
  }
}
