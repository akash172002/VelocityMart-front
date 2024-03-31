import { mongooseConnect } from "@/lib/mogoose";
import { Review } from "@/models/Review";

export default async function hanlde(req, res) {
  await mongooseConnect();

  if (req.method === "POST") {
    const { title, description, stars, product, userEmail, userImage } =
      req.body;
    res.json(
      await Review.create({
        title,
        description,
        stars,
        product,
        userEmail,
        userImage,
      })
    );
  }

  if (req.method === "GET") {
    const { product } = req.query;
    res.json(await Review.find({ product }, null, { sort: { createdAt: -1 } }));
  }
}
