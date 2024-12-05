// Ładowanie zmiennych środowiskowych z pliku .env do process.env
require('dotenv').config();

// Inicjalizacja biblioteki Stripe z użyciem klucza sekretnego
// W środowisku produkcyjnym należy zastąpić klucz zmienną środowiskową dla lepszego bezpieczeństwa
const stripe = require('stripe')("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");

// Funkcja do obliczania kwoty zamówienia (obecnie zakodowana na stałe)
// W rzeczywistej aplikacji należy zastąpić tę wartość dynamicznym obliczeniem na podstawie danych w żądaniu
const calculateOrderAmount = () => {
    return 1400; // Kwota w najmniejszej jednostce waluty (np. grosze dla PLN)
};

// Eksportowana funkcja obsługująca żądania płatności
exports.paymentHandler = async (req, res) => {
    const { items } = req.body; // Pobranie danych o przedmiotach z ciała żądania

    try {
        // Tworzenie obiektu PaymentIntent w Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items), // Kwota zamówienia
            currency: "pln", // Waluta płatności
            automatic_payment_methods: {
                enabled: true, // Automatyczna obsługa metod płatności
            },
        });

        // Odesłanie odpowiedzi z clientSecret i linkiem do panelu Stripe
        res.send({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        });
    } catch (error) {
        // Obsługa błędów w przypadku problemów z tworzeniem PaymentIntent
        console.error("Błąd podczas tworzenia obiektu PaymentIntent:", error);
        res.status(500).send({
            message: "Wystąpił błąd podczas tworzenia płatności",
            error: error.message, // Szczegóły błędu
        });
    }
};
