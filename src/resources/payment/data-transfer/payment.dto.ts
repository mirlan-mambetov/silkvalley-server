import { PaymentEnumStatus } from 'src/enums/Payment.enum'

export interface StripePaymentIntentSucceededEvent {
  id: string
  object: string
  api_version: string
  created: number
  data: {
    object: {
      id: string
      object: string
      amount: number
      amount_capturable: number
      amount_details: [Object]
      amount_received: number
      application: null
      application_fee_amount: null
      automatic_payment_methods: null
      canceled_at: null
      cancellation_reason: null
      capture_method: string
      client_secret: string
      confirmation_method: string
      created: number
      currency: string
      customer: null
      description: string
      // description: 'Order # 3',
      invoice: null
      last_payment_error: null
      latest_charge: 'ch_3P4OWgB0uQx8YYh71hRuqqfK'
      livemode: false
      metadata: {}
      next_action: null
      on_behalf_of: null
      payment_method: string
      payment_method_configuration_details: null
      payment_method_options: [Object]
      payment_method_types: []
      processing: null
      receipt_email: null
      review: null
      setup_future_usage: null
      shipping: null
      source: null
      statement_descriptor: null
      statement_descriptor_suffix: null
      status: string
      transfer_data: null
      transfer_group: null
    }
    amount: number
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string
    idempotency_key: string
  }
  type: PaymentEnumStatus
}
