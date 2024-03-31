import styled from "styled-components";
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarRatings";
import TextArea from "./TextArea";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";

import Spinner from "./Spinner";
import { useSession } from "next-auth/react";

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const SubTitle = styled.h3`
  font-size: 1rem;
  margin-top: 5px;
`;

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
`;

const ReviewWrapper = styled.div`
  margin-bottom: 10px;
  scroll-behavior: smooth;
  border-top: 1px solid #ccc;
  padding: 12px 0;
  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
    font-weight: normal;
  }
  p {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1rem;
    color: #555;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  time {
    font-size: 14px;
    font-weight: bold;
    color: #aaa;
  }
`;

const ReviewId = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 10%;
    height: 100%;
  }
`;

const ReviewSection = styled.div`
  overflow: scroll;
  height: 250px;
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge, and Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export default function ProductReviews({ product }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const session = useSession();

  const userEmail = session?.data?.user?.email;
  const userImage = session?.data?.user?.image;

  async function submitReview() {
    const data = {
      title,
      description,
      stars,
      product: product._id,
      userEmail,
      userImage,
    };

    await axios.post("/api/reviews", data).then((res) => {
      setStars(0);
      setTitle("");
      setDescription("");

      getReviews();
    });
  }

  useEffect(() => {
    if (!reviews) {
      return;
    }
    getReviews();
  }, []);

  function getReviews() {
    setReviewsLoading(true);
    axios.get("/api/reviews?product=" + product._id).then((res) => {
      setReviews(res.data);
      setReviewsLoading(false);
    });
  }

  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
        <div>
          <WhiteBox>
            <SubTitle>Add a review</SubTitle>
            <div>
              <StarsRating
                value={stars}
                onChange={(n) => {
                  setStars(n);
                }}
              />
            </div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              placeholder="Was it good? Pros? Cons?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <Button black onClick={submitReview}>
                Submit your review
              </Button>
            </div>
          </WhiteBox>
        </div>
        <ReviewSection>
          <WhiteBox>
            <SubTitle>All review</SubTitle>
            {reviewsLoading && <Spinner fullWidth={true} />}
            {reviews.length === 0 && <p>No reviews :(</p>}
            {reviews.length > 0 &&
              reviews.map((r) => (
                <ReviewWrapper key={r._id}>
                  <ReviewHeader>
                    <StarsRating
                      cursor={"no"}
                      size={"sm"}
                      disabled={true}
                      defaultHowMany={r.stars}
                    />

                    <time>{new Date(r.createdAt).toLocaleString("IN")}</time>
                  </ReviewHeader>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  <ReviewId>
                    <p>{r._id}</p>
                    <img src={r.userImage} alt="" />
                  </ReviewId>
                </ReviewWrapper>
              ))}
          </WhiteBox>
        </ReviewSection>
      </ColsWrapper>
    </div>
  );
}
