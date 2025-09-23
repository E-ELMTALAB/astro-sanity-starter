import { CHECKOUT_PARAM_CONFIG, normalizeCheckoutParams } from '@/lib/checkout';

interface CheckoutPageProps {
  searchParams: Partial<Record<string, string | string[]>>;
}

function coerceSearchParams(searchParams: CheckoutPageProps['searchParams']) {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      flat[key] = value[0];
    } else if (value != null) {
      flat[key] = value;
    }
  }
  return flat;
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  let error: string | null = null;
  let params: ReturnType<typeof normalizeCheckoutParams> | null = null;

  try {
    params = normalizeCheckoutParams(coerceSearchParams(searchParams));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <main style={{ padding: '3rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.5 }}>
      <h1>Telegram Checkout</h1>
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <section aria-live="polite">
          <h2>Order summary</h2>
          <dl>
            {Object.entries(params ?? {}).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <footer style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#555' }}>
        Required params: {CHECKOUT_PARAM_CONFIG.required.join(', ')}. Optional params:{' '}
        {CHECKOUT_PARAM_CONFIG.optional.join(', ') || 'None'}.
      </footer>
    </main>
  );
}
