import { IsBoolean, IsString } from "class-validator";

export class HandleSessionDisconnectingDto {
  @IsString()
  readonly sessionId: string;

  @IsBoolean()
  readonly isDisconnectIntentional: boolean;
}
