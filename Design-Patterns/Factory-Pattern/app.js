import PaymentFactory from "./paymentFactory.js";

const payment = PaymentFactory.createProcessor("paypal");
payment.pay(100);

