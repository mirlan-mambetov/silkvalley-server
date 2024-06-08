import { Injectable } from '@nestjs/common'
import { MailtrapClient } from 'mailtrap'

@Injectable()
export class MailService {
  private readonly TOKEN = '6bea5a14cccd5ff7040507d36a084584'
  private readonly ENDPOINT = 'https://send.api.mailtrap.io/'

  client: MailtrapClient

  constructor() {
    this.client = new MailtrapClient({ token: this.TOKEN })
  }

  sendEmail(email: string, name: string, text: string) {
    const sender = {
      name: 'Silk Valley',
      email: 'mailtrap@slkvalley.com',
    }
    this.client
      .send({
        from: sender,
        to: [{ email, name }],
        template_uuid: '8a0cae78-f715-415a-8c57-d7126e3f3139',
        template_variables: {
          user_name: `${name}`,
          order_id: 'adawdawdsad#3rfs',
          strong: 'Принят на обработку!',
          message: `${text}`,
        },
      })
      .then(console.log, console.error)
  }
}
