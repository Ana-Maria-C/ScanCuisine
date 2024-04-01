import React from "react";
import { Card, Button } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import "./CustomCard.css";
import { Link } from "react-router-dom";

const { Meta } = Card;

interface CustomCardProps {
  id: string;
  imageUrl: string;
  title: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ id, imageUrl, title }) => {
  return (
    <Card
      className="custom-card"
      hoverable
      cover={<img alt="example" src={imageUrl} />}
      actions={[
        <Button icon={<HeartOutlined />} key="favorite">
          Favorite
        </Button>,
        <Link to={`/recipe/${id}`}>
          <Button icon={<EyeOutlined />} key="view">
            View
          </Button>
        </Link>,
      ]}
    >
      <Meta title={title} />
      <span style={{ display: "none" }}>{id}</span>
    </Card>
  );
};

export default CustomCard;
