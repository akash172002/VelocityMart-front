import styled from "styled-components";

const StyledOrder = styled.div`
  margin: 10px 0px;
  padding: 10px 0px;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px;
  align-items: center;

  time {
    font-size: 0.8rem;
    line-height: 1rem;
    color: #ccc;
  }
`;

const ProductRow = styled.div`
  span {
    color: #aaa;
  }
`;

const Address = styled.div`
  font-size: 0.7rem;
  line-height: 0.8rem;
  margin-top: 5px;
  color: #888;
`;

export default function SingleOrder({ line_items, createdAt, ...rest }) {
  return (
    <StyledOrder>
      <div>
        <time>{new Date(createdAt).toLocaleString("US-IN")}</time>
        <Address>
          {rest.name} <br />
          {rest.email} <br />
          {rest.address} <br />
          {rest.postal} <br />
          {rest.city} <br />
          {rest.country}
        </Address>
      </div>
      <div>
        {line_items.map((item) => (
          <ProductRow key={item}>
            <span>{item.quantity} X </span>
            {item.price_data.product_data.name}
          </ProductRow>
        ))}
      </div>
    </StyledOrder>
  );
}
