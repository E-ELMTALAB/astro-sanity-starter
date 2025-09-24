import { z } from 'zod';
import checkoutConfig from './checkout-config.json';

const checkoutSchema = z.object({
  basePath: z.string(),
  paramConfig: z.object({
    required: z.tuple([z.literal('productId')]),
    optional: z.tuple([z.literal('quantity'), z.literal('variantId'), z.literal('ref')]),
    defaults: z.object({
      quantity: z.literal('1')
    })
  })
});

const config = checkoutSchema.parse(checkoutConfig);

export const CHECKOUT_BASE_PATH = config.basePath;

export const CHECKOUT_PARAM_CONFIG = config.paramConfig;

export type CheckoutParamName =
  | (typeof CHECKOUT_PARAM_CONFIG.required)[number]
  | (typeof CHECKOUT_PARAM_CONFIG.optional)[number];

export type CheckoutParams = Partial<Record<CheckoutParamName, string>> & {
  productId: string;
};

export function normalizeCheckoutParams(input: Partial<Record<CheckoutParamName, string>>): CheckoutParams {
  const params: Record<CheckoutParamName, string> = {} as Record<CheckoutParamName, string>;
  const { required, optional, defaults } = CHECKOUT_PARAM_CONFIG;

  for (const key of required) {
    const value = input[key];
    if (!value) {
      throw new Error(`Missing required checkout param "${key}"`);
    }
    params[key] = value;
  }

  for (const key of optional) {
    const value = input[key] ?? defaults[key as keyof typeof defaults];
    if (value) {
      params[key] = value;
    }
  }

  return params as CheckoutParams;
}

export function buildCheckoutUrl(
  origin: string,
  params: Partial<Record<CheckoutParamName, string>>
): URL {
  const normalized = normalizeCheckoutParams(params);
  const url = new URL(CHECKOUT_BASE_PATH, origin);
  for (const [key, value] of Object.entries(normalized)) {
    url.searchParams.set(key, value);
  }
  return url;
}
