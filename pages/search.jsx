import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  margin: 30px 0 30px;
  font-size: 1.4rem;
`;

const InputWrapper = styled.div`
  position: sticky;
  top: 68px;
  margin: 25px 0;
  padding: 30px 0;
  background-color: #eeeeeeaa;
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [product, setProduct] = useState([]);
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProduct([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Header />
      <Center>
        <InputWrapper>
          <SearchInput
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            autoFocus
            placeholder="Search for prodcuts..."
          />
        </InputWrapper>
        {!isLoading && phrase !== "" && product.length === 0 && (
          <h2>No products found for query {phrase} 🥲</h2>
        )}
        {isLoading && <Spinner fullWidth={true} />}
        {!isLoading && product.length > 0 && (
          <ProductsGrid products={product} />
        )}
      </Center>
    </>
  );
}
