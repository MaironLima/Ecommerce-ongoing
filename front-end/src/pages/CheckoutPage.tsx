import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import UniversalBreadcrum from "@/components/UniversalBreadcrum";
import privateAPI from "@/services/api/privateApi";
import { getStripe } from "@/services/api/stripe";
import { useCartStore } from "@/stores/cartStore";
import { useStore } from "@/stores/store";

interface CheckoutSessionResponse {
  order_id: string;
  client_secret: string;
  order_status: string;
  total: number | string;
  currency: string;
}

interface OrderStatusResponse {
  id: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  total: number | string;
  currency: string;
}

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 30000;

function CheckoutForm({
  orderId,
  total,
}: {
  orderId: string;
  total: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pollOrderStatus = async () => {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      try {
        const { data } = await privateAPI.get<OrderStatusResponse>(
          `/checkout/${orderId}/status`,
        );
        if (data.status === "PAID") {
          navigate(`/orders?paid=${orderId}`);
          return;
        }
        if (data.status === "FAILED" || data.status === "CANCELLED") {
          setMessage(
            `Payment ${data.status.toLowerCase()}. Please try again or contact support.`,
          );
          setSubmitting(false);
          return;
        }
      } catch {
        // ignore transient errors and keep polling
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
    setMessage(
      "Payment is taking longer than expected. Check your orders page shortly.",
    );
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await pollOrderStatus();
    } else if (paymentIntent) {
      setMessage(
        `Payment status: ${paymentIntent.status}. You can check your orders page.`,
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="global-btn flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing...
          </>
        ) : (
          `Pay R$ ${total.toFixed(2)}`
        )}
      </button>
      {message && (
        <p
          className={
            "text-sm " +
            (message.toLowerCase().includes("succeed") ||
            message.toLowerCase().includes("check")
              ? "text-primary"
              : "text-destructive")
          }
          role="alert"
        >
          {message}
        </p>
      )}
    </form>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useStore((s) => s.accessToken);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const clearLocal = useCartStore((s) => s.clearLocal);

  const cartItemIds = (location.state as { cartItemIds?: string[] } | null)?.cartItemIds;

  const [session, setSession] = useState<CheckoutSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Please log in to checkout.");
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        await fetchCart();
        const cartNow = useCartStore.getState().items;
        if (cartNow.length === 0) {
          setError("Your cart is empty.");
          setLoading(false);
          return;
        }
        if (cartItemIds && cartItemIds.length === 0) {
          setError("No items selected. Please select items to checkout.");
          setLoading(false);
          return;
        }
        const validIds = cartItemIds
          ? cartItemIds.filter((id) => cartNow.some((i) => i.id === id))
          : null;
        if (cartItemIds && validIds && validIds.length === 0) {
          setError("Selected items are no longer in your cart.");
          setLoading(false);
          return;
        }
        const { data } = await privateAPI.post<CheckoutSessionResponse>(
          "/checkout/session",
          { currency: "brl", ...(validIds ? { cart_item_ids: validIds } : {}) },
        );
        setSession(data);
        setLoading(false);
      } catch (e: any) {
        setError(
          e?.response?.data?.error ?? "Failed to start checkout. Please retry.",
        );
        setLoading(false);
      }
    })();
  }, [accessToken, fetchCart, cartItemIds]);

  const stripePromise = useMemo(() => getStripe(), []);
  const total = session ? Number(session.total) : 0;
  const currency = session?.currency ?? "brl";

  const options = useMemo(
    () => (session?.client_secret ? { clientSecret: session.client_secret } : null),
    [session?.client_secret],
  );

  if (loading) {
    return (
      <div className="min-h-svh flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="global-card animate-pulse text-muted-foreground">
            Preparing checkout...
          </div>
        </div>
      </div>
    );
  }

  if (error || !session || !options) {
    return (
      <div className="min-h-svh flex flex-col bg-background">
        <Header />
        <div className="w-full max-w-7xl mx-auto px-6 pt-4">
          <UniversalBreadcrum labels={["Checkout"]} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="global-card border-destructive/30 bg-destructive/10 text-destructive-foreground">
            {error ?? "Unable to start checkout"}
          </div>
          <button
            className="global-btn bg-secondary text-secondary-foreground flex items-center gap-2"
            onClick={() => {
              clearLocal();
              navigate("/cart");
            }}
          >
            <ArrowLeft size={16} /> Back to cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <Header />
      <div className="w-full max-w-7xl mx-auto px-6 pt-4">
        <UniversalBreadcrum labels={["Cart", "Checkout"]} />
      </div>
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 pb-6 grid grid-cols-1 gap-6 items-start">
        <div className="global-card flex flex-col gap-4">
          <h1 className="global-title">Checkout</h1>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-muted-foreground">Order</span>
            <span className="text-sm text-foreground">
              #{session.order_id.slice(0, 8)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              R$ {total.toFixed(2)} {currency.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="global-card">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm orderId={session.order_id} total={total} />
          </Elements>
        </div>

        <button
          className="global-btn bg-secondary text-secondary-foreground flex items-center justify-center gap-2"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft size={16} /> Back to cart
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;