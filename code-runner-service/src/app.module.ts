import { Module } from "@nestjs/common";

import { CodeRunnerModule } from "./code-runner/code-runner.module";

@Module({
  imports: [CodeRunnerModule],
})
export class AppModule {}
