import { Request, Response, Router } from "express";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, stripeWebhookSecret } from "../utils/constant";
import { webhookInterface } from "../interfaces/webhook.interface";
import BookingService from "../services/booking.service";


const bookingService = new BookingService();

const router = Router();
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// Ruta del webhook
router.post("/", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] || "";
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret!);
    const result = event.data.object as webhookInterface;

    const sunbeds = JSON.parse(result.metadata.sunbeds); 
    const date = new Date(result.metadata.date); 
    const totalPrice = parseFloat(result.metadata.totalPrice);
    const userId = result.metadata.userId;

    if (!sunbeds.name) {
      return res.status(400).send("El ID del sunbed no puede ser nulo.");
    }

    const data = {
      type: sunbeds,
      date,
      totalPrice,
      userId,
    };
    switch (event.type) {
      case "checkout.session.completed":
        console.log("Checkout session completed!");
        await bookingService.finalizeBooking(data);
        break;
      case "payment_intent.succeeded":
        console.log("PaymentIntent succeeded!");
        await bookingService.finalizeBooking(data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
       await bookingService.releaseProcessingSunbeds(date, data.type);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${(error as Error).message}`);
  }
});

export default router;
