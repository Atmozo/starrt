class PayPal {
  pay(amount) {
    console.log(`Paid ${amount} via PayPal`);
  }
}

class Stripe {
  pay(amount) {
    console.log(`Paid ${amount} via Stripe`);
  }
}

class PaymentFactory {
  static createProcessor(type) {
    if (type === "paypal") return new PayPal();
    if (type === "stripe") return new Stripe();
    throw new Error("Invalid payment type");
  }
}

export default PaymentFactory;

