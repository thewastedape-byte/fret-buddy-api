const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const supabase = require('../services/supabase');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  pro: {
    name: 'Fret Buddy Pro',
    price: 999, // $9.99 in cents
    interval: 'month',
    features: ['Unlimited lessons', 'Full AI feedback', 'YouTube search', 'Progress tracking'],
  },
  master: {
    name: 'Fret Buddy Master',
    price: 2499, // $24.99 in cents
    interval: 'month',
    features: ['Everything in Pro', 'Custom lesson plans', 'Song learning mode', 'Priority support'],
  },
};

// GET /api/stripe/plans
router.get('/plans', (req, res) => {
  res.json({ plans: PLANS });
});

// POST /api/stripe/checkout - create checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { plan, email, success_url, cancel_url } = req.body;

    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });

    const planData = PLANS[plan];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planData.name,
              description: planData.features.join(', '),
            },
            unit_amount: planData.price,
            recurring: {
              interval: planData.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: success_url || 'https://fretbuddy.app/success',
      cancel_url: cancel_url || 'https://fretbuddy.app/cancel',
      metadata: {
        plan,
        email: email || '',
      },
    });

    res.json({ url: session.url, session_id: session.id });

  } catch (err) {
    console.error('[stripe/checkout]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook - handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('[stripe/webhook] signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.metadata?.email || session.customer_email;
    const plan = session.metadata?.plan || 'pro';

    if (email) {
      await supabase
        .from('fret_buddy_users')
        .update({ subscription: plan })
        .eq('email', email);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    // Downgrade to free
    const subscription = event.data.object;
    const customer = await stripe.customers.retrieve(subscription.customer);
    if (customer.email) {
      await supabase
        .from('fret_buddy_users')
        .update({ subscription: 'free' })
        .eq('email', customer.email);
    }
  }

  res.json({ received: true });
});

module.exports = router;
