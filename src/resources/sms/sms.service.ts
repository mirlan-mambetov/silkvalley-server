import { Injectable } from '@nestjs/common'
import * as https from 'https'

@Injectable()
export class SmsService {
  private readonly hostName = '3gekln.api.infobip.com'
  private readonly pathName = '/sms/2/text/advanced'
  private readonly apiKey =
    '15abb500c92caa679f6f813fdf44e638-7b5ce837-2b4d-47bc-be36-29a65af4cb76'

  async sendSms(to: string, message: string) {
    const options = {
      method: 'POST',
      hostname: `${this.hostName}`,
      path: `${this.pathName}`,
      headers: {
        Authorization: `App ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      maxRedirects: 20,
    }
    const request = https.request(options, (res) => {
      let chunks = []

      res.on('data', (chunk) => {
        chunks.push(chunk)
      })

      res.on('end', function (chunk) {
        var body = Buffer.concat(chunks)
        console.log(body.toString())
      })

      res.on('error', function (error) {
        console.error(error)
      })
    })
    var postData = JSON.stringify({
      messages: [
        {
          destinations: [{ to }],
          from: 'Silk Valley',
          text: message,
        },
      ],
    })
    request.write(postData)
    request.end()
  }
}
