require('dotenv').config(); // Load environment variables

const stripe = require('stripe')("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"); // Use your secret key

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    return 1400; // 14 EUR (1400 cents)
  };
  
  exports.paymentHandler = async (req, res) => {
    const { items } = req.body;
  
    try {
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "pln",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).send({
        message: "Error creating payment intent",
        error: error.message, // Send error details for debugging
      });
    }
  };
