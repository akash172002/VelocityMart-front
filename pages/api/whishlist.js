import { mongooseConnect } from "@/lib/mogoose";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { WhishedProduct } from "@/models/WhishedProduct";

export default async function handle(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { product } = req.body;
    const wishedDoc = session?.user
      ? await WhishedProduct.findOne({
          userEmail: session?.user?.email,
          product: product,
        })
      : [];
    if (wishedDoc) {
      await WhishedProduct.findByIdAndDelete(wishedDoc._id);
      res.json({ wishedDoc });
    } else {
      await WhishedProduct.create({
        userEmail: session?.user.email,
        product: product,
      });
      res.json("created");
    }
  }

  if (req.method === "GET") {
    res.json(
      await WhishedProduct.find({ userEmail: session?.user?.email }).populate(
        "product"
      )
    );
  }
}
