import { Module } from '@nestjs/common'
import { MailService } from './mail.service'

@Module({
  imports: [],
  providers: [MailService],
  controllers: [],
})
export class MailModule {}
