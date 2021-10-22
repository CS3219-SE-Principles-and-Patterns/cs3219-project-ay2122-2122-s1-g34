import { Global, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Global()
@Injectable()
export class FirebaseService {
  constructor() {
    // TODO: setup firebase admin SDK for prod
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
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

  createCustomToken(userId: string) {
    return admin.auth().createCustomToken(userId);
  }
}
