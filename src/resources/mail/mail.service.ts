import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  sendRegisterEmail(email: string, privateKey: string) {
    this.mailService
      .sendMail({
        to: email,
        subject: 'Потдвердите E-mail',
        template: 'register',
        context: {
          email,
          privateKey,
        },
      })
      .then((res) => console.log(`RES SENDING MAIL ${res}`))
      .catch((err) => console.log(`CATCH SENDING MAIL ${err}`))
  }
}
