import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Sign up for an account" })
  @ApiResponse({
    status: 200,
    description: "User successfully created",
    schema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "JWT token that can used for authorization",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "User already exists or invalid input",
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
