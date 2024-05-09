export enum PaymentEnumStatus {
  PAYMENT_INTENT_SUCCESS = 'payment_intent.succeeded',
  PAYMENT_INTENT_CREATED = 'payment_intent.created',
  PAYMENT_INTENT_PROCESSING = 'payment_intent.processing',
  PAYMENT_INTENT_CANCELED = 'payment_intent.canceled',
  PAYMENT_INTENT_CLOSED = 'payment_intent.payment_failed',
  PAYMENT_INTENT_FILED = 'payment_intent.payment_failed',
}
