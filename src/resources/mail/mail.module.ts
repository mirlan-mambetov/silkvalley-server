import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { join } from 'path'
import { MailService } from './mail.service'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'slkvalley.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
          user: 'info',
          pass: 'Mambetovmn1995#',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'info@slkvalley.com',
      },
      template: {
        dir: join(__dirname, '..', '..', '..', 'views', 'mail'),
        adapter: new HandlebarsAdapter(null, {
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
          cache: false,
        },
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
})
export class MailModule {}
