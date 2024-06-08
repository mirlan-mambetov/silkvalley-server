import { StripeModuleConfig } from '@golevelup/nestjs-stripe'
import { ConfigService } from '@nestjs/config'

export const stripeConfig = (config: ConfigService): StripeModuleConfig => {
  return {
    apiKey: config.get('STRIPE_API_KEY'),
    apiVersion: '2024-04-10',
    webhookConfig: {
      stripeSecrets: {
        account: config.get('STRIPE_SIGNING_SECRET'),
        connect: '',
      },
      requestBodyProperty: 'rawBody',
    },
  }
}
