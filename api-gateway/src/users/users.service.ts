import { Injectable } from "@nestjs/common";
import { FirebaseService } from "src/firebase/firebase.service";

import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createUserDto: CreateUserDto) {
    const userRecord = await this.firebaseService.createUser(createUserDto);
    const token = await this.firebaseService.createCustomToken(userRecord.uid);
    return { token };
  }
}
