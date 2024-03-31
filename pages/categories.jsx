import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import { WhishedProduct } from "@/models/WhishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mogoose";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 0;
  align-items: center;
  gap: 15px;
  h2 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  a {
    color: #555;
    display: inline-block;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  background-color: #ddd;
  height: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #555;
`;

export default function Categories({
  mainCategories,
  categoriesProducts,
  wishedProduct = [],
}) {
  return (
    <>
      <Header />
      <Center>
        {mainCategories.map((cate) => (
          <CategoryWrapper key={cate.name}>
            <CategoryTitle>
              <h2> {cate.name}</h2>
              <div>
                <Link href={"/category/" + cate._id}>Show all {cate.name}</Link>
              </div>
            </CategoryTitle>
            <CategoryGrid>
              {categoriesProducts[cate._id].map((p, index) => (
                <RevealWrapper key={p._id} delay={index * 50}>
                  <ProductBox {...p} wished={wishedProduct?.includes(p._id)} />
                </RevealWrapper>
              ))}
              <div>
                <RevealWrapper delay={categoriesProducts[cate._id].length * 50}>
                  <ShowAllSquare href={"/category/" + cate._id}>
                    show all &rarr;
                  </ShowAllSquare>
                </RevealWrapper>
              </div>
            </CategoryGrid>
          </CategoryWrapper>
        ))}
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter((c) => !c.parent);
  const categoriesProduct = {};
  const allFetchProductsId = [];

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();
    const childCatId = categories
      .filter((c) => c?.parent?.toString() === mainCatId)
      .map((c) => c._id.toString());
    const categoriesIds = [mainCatId, ...childCatId];
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });

    allFetchProductsId.push(...products.map((p) => p._id.toString()));

    categoriesProduct[mainCat._id] = products;
  }

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProduct = session?.user
    ? await WhishedProduct.find({
        userEmail: session?.user?.email,
        product: allFetchProductsId,
      })
    : [];

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProduct)),
      wishedProduct: wishedProduct.map((p) => p.product.toString()),
    },
  };
}
