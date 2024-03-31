import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mogoose";
import { Product } from "@/models/Product";
import { authOptions } from "./api/auth/[...nextauth]";
import { WhishedProduct } from "@/models/WhishedProduct";
import { getServerSession } from "next-auth";

export default function ProductPage({ products, wishedProducts }) {
  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} wishedProduct={wishedProducts} />
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProduct = session?.user
    ? await WhishedProduct.find({
        userEmail: session?.user?.email,
        product: products.map((p) => p._id.toString()),
      })
    : [];

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProduct.map((p) => p.product.toString()),
    },
  };
}
