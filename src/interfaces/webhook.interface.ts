export interface webhookInterface {
  id: string;
  object: string;
  adaptive_pricing: {
    enabled: boolean;
  };
  after_expiration: any;
  allow_promotion_codes: any;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
    enabled: boolean;
    liability: any;
    status: any;
  };
  billing_address_collection: any;
  cancel_url: string;
  client_reference_id: any;
  client_secret: any;
  consent: any;
  consent_collection: any;
  created: number;
  currency: string;
  currency_conversion: any;
  custom_fields: any[];
  custom_text: {
    after_submit: any;
    shipping_address: any;
    submit: any;
    terms_of_service_acceptance: any;
  };
  customer: any;
  customer_creation: string;
  customer_details: {
    address: {
      city: any;
      country: string;
      line1: any;
      line2: any;
      postal_code: any;
      state: any;
    };
    email: string;
    name: string;
    phone: any;
    tax_exempt: string;
    tax_ids: any[];
  };
  customer_email: any;
  expires_at: number;
  invoice: any;
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids: any;
      custom_fields: any;
      description: any;
      footer: any;
      issuer: any;
      metadata: Record<string, any>;
      rendering_options: any;
    };
  };
  livemode: boolean;
  locale: any;
  metadata: {
    sunbeds: any;
    date: string;
    email: string;
    totalPrice: any;
    name: string;
  };
  mode: string;
  payment_intent: string;
  payment_link: any;
  payment_method_collection: string;
  payment_method_configuration_details: any;
  payment_method_options: {
    card: {
      request_three_d_secure: string;
    };
  };
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: {
    enabled: boolean;
  };
  recovered_from: any;
  saved_payment_method_options: any;
  setup_intent: any;
  shipping_address_collection: any;
  shipping_cost: any;
  shipping_details: any;
  shipping_options: any[];
  status: string;
  submit_type: any;
  subscription: any;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: string;
  url: any;
}
