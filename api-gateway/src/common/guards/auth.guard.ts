import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

import { FirebaseService } from "../../firebase/firebase.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.token;

    try {
      const user = await this.firebaseService.verifyIdToken(token);

      // attach user to request for easy access
      request.user = user;

      // users must have display name and email address
      return !!user && !!user.name && !!user.email;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
