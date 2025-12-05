import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const { 
      items, 
      customerEmail, 
      orderId,
      shippingCost,
      discount,
      promoCode 
    } = await req.json();

    console.log("Creating checkout session for order:", orderId);
    console.log("Items:", JSON.stringify(items));

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: {
      name: string;
      price: number;
      quantity: number;
      variantName?: string;
      imageUrl?: string;
    }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.variantName ? `${item.name} - ${item.variantName}` : item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if not free
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frais de livraison",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create discounts if promo code was applied
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (discount > 0 && promoCode) {
      // Create a coupon for this session
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "eur",
        name: promoCode,
        duration: "once",
      });
      discounts.push({ coupon: coupon.id });
    }

    const origin = req.headers.get("origin") || "https://hkijzqzkckjtepjmwjkw.lovableproject.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        orderId: orderId,
        promoCode: promoCode || "",
      },
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
