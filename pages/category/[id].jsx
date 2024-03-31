import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5em;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;

  color: #444;
  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
    color: #444;

    option {
      background-color: #444;
      color: #ccc;
    }
  }
`;

const NoMessage = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 2rem;
  margin-top: 200px;
`;

export default function CategoryPage({
  category,
  subCategories,
  products: originalProducts,
}) {
  const defaultSorting = "_id-desc";
  const [products, setproducts] = useState(originalProducts);
  const defaultFilterValues = category.properties.map((p) => ({
    name: p.name,
    value: "all",
  }));

  const [filtersValue, setFiltersValue] = useState(defaultFilterValues);

  const [sort, setSort] = useState(defaultSorting);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValue((prev) => {
      return prev.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }

  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProduct(true);
    const catIds = [category._id, ...subCategories?.map((c) => c._id)];

    const params = new URLSearchParams();
    params.set("categories", catIds.join(","));
    params.set("sort", sort);

    filtersValue.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });

    const url = `/api/products?` + params.toString();

    axios.get(url).then((res) => {
      setproducts(res.data);
      setLoadingProduct(false);
    });
  }, [filtersValue, sort, filtersChanged]);

  return (
    <>
      <Header />
      <Center>
        <CategoryHeader>
          <h1>{category.name}</h1>
          <FiltersWrapper>
            {category.properties.map((prop) => (
              <Filter key={prop.name}>
                <span>{prop.name}</span>
                <select
                  onChange={(e) =>
                    handleFilterChange(prop.name, e.target.value)
                  }
                  value={filtersValue.find((f) => f.name === prop.name).value}
                >
                  <option value="all">All</option>
                  {prop.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </Filter>
            ))}
            <Filter>
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setFiltersChanged(true);
                }}
              >
                <option value="price-asc">price, lowest first</option>
                <option value="price-desc">price, highest first</option>
                <option value="_id-desc">newest first</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </Filter>
          </FiltersWrapper>
        </CategoryHeader>
        {loadingProduct && <Spinner fullWidth />}
        {!loadingProduct && (
          <div>
            {products.length > 0 && <ProductsGrid products={products} />}
            {products.length === 0 && (
              <NoMessage>Sorry, No products found 😥</NoMessage>
            )}
          </div>
        )}
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategory = await Category.find({ parent: category._id });

  const catIds = [category._id, ...subCategory.map((c) => c._id)];

  const products = await Product.find({ category: catIds });

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategory)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
