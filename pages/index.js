import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProduct from "@/components/NewProduct";
import { mongooseConnect } from "@/lib/mogoose";
import { Product } from "@/models/Product";
import { WhishedProduct } from "@/models/WhishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";

export default function HomePage({
  featuredProduct,
  newProducts,
  whishedNewProducts,
}) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProduct products={newProducts} wishedProduct={whishedNewProducts} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const featuredProductSetting = await Setting.findOne({
    name: "featuredProductId",
  });
  const featuredProductId = featuredProductSetting.value;
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 12,
  });

  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const wishedNewProducts = session?.user
    ? await WhishedProduct.find({
        userEmail: session?.user?.email,
        product: newProducts.map((p) => p._id.toString()),
      })
    : [];

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      whishedNewProducts: wishedNewProducts.map((p) => p.product.toString()),
    },
  };
}
