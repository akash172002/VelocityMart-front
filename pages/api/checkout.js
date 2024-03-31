import { mongooseConnect } from "@/lib/mogoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Setting } from "@/models/Setting";

const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handle(req, res) {
  await mongooseConnect();
  if (req.method !== "POST") {
    res.json("should be a POST request");
  }

  const { name, email, city, postal, address, country, cartProducts } =
    req.body;

  const productsId = cartProducts;
  const uniqueId = [...new Set(productsId)];

  const productsInfo = await Product.find({ _id: uniqueId });
  console.log(productsInfo);

  let line_items = [];

  for (const productId of uniqueId) {
    const productInfo = productsInfo.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsId.filter((id) => id === productId)?.length || 0;

    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "INR",
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price * 100,
        },
      });
    }
  }

  const session = await getServerSession(req, res, authOptions);

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postal,
    address,
    country,
    paid: false,
    userEmail: session?.user?.email,
  });

  const shippingFeeSetting = await Setting.findOne({ name: "shippingFee" });

  const shippingFeeIn = parseInt(shippingFeeSetting.value || "0") * 100;

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=1",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString() },
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "shipping fee",
          type: "fixed_amount",
          fixed_amount: { amount: shippingFeeIn, currency: "INR" },
        },
      },
    ],
  });

  res.json({
    url: stripeSession.url,
  });
}
