import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabed from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
`;

const CityHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const WishedProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [addressLoading, setAddressLoading] = useState(true);
  const [wishLoading, setWishLoding] = useState(true);
  const [wishedProduct, setWishedProduct] = useState([]);
  const [activeTab, setActiveTab] = useState("Orders");
  const [order, setOrder] = useState([]);
  const [orderLoding, setOrderLoading] = useState(true);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {
    await signIn("google");
  }

  function saveAddress() {
    const data = { name, city, email, address, postal, country };
    axios.put("/api/address", data);
  }

  useEffect(() => {
    if (!session) {
      return;
    }
    setWishLoding(false);
    setAddressLoading(false);
    setOrderLoading(false);

    axios.get("/api/address/").then((res) => {
      setName(res.data?.name);
      setEmail(res.data?.email);
      setPostal(res.data?.postal);
      setCity(res.data?.city);
      setAddress(res.data?.address);
      setCountry(res.data?.country);
      setAddressLoading(true);
    });

    axios.get("/api/whishlist").then((res) => {
      setWishedProduct(res.data.map((wp) => wp.product));
      setWishLoding(true);
    });

    axios.get("/api/order").then((res) => {
      setOrder(res.data);
      setOrderLoading(true);
    });
  }, [session]);

  function productRemovedFromWishList(idToRemove) {
    setWishedProduct((products) => {
      return [...products.filter((p) => p?._id?.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabed
                  tabs={["Order", "Wishlist"]}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === "Order" && (
                  <>
                    {!orderLoding && <Spinner fullWidth={true} />}
                    {order.length === 0 && session && (
                      <p>Your order is empty</p>
                    )}
                    {!session && <p>Please Login to fetch orders 😊</p>}
                    {orderLoding && (
                      <div>
                        {order.length > 0 &&
                          order.map((o) => (
                            <SingleOrder key={order._id} {...o} />
                          ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Wishlist" && (
                  <>
                    {!wishLoading && <Spinner fullWidth={true} />}

                    {wishLoading && (
                      <>
                        {wishedProduct.length === 0 && (
                          <>
                            {session && <p>Your wishlist is empty</p>}
                            {!session && (
                              <p>Login to add products to your wishlist 😊</p>
                            )}
                          </>
                        )}
                        <WishedProductGrid>
                          {wishedProduct.length > 0 &&
                            wishedProduct.map((wp) => (
                              <ProductBox
                                {...wp}
                                wished={true}
                                key={wp?._id}
                                onRemoveFronWishList={
                                  productRemovedFromWishList
                                }
                              />
                            ))}
                        </WishedProductGrid>
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                {session ? <h2>Account Details</h2> : <h2>Login</h2>}
                {!addressLoading && <Spinner fullWidth={true} />}
                {addressLoading && session && (
                  <>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={name}
                      name={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="email"
                      value={email}
                      name={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="city"
                        value={city}
                        name={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Postal Code"
                        value={postal}
                        name={postal}
                        onChange={(e) => setPostal(e.target.value)}
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="Street Address"
                      value={address}
                      name={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Country"
                      value={country}
                      name={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />

                    <Button black block onClick={saveAddress}>
                      Save
                    </Button>
                    <hr />
                  </>
                )}

                {session && (
                  <Button black onClick={logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button black onClick={login}>
                    Login with Google
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
