import React from "react";
import { Card, Button } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import "./CustomCard.css";

const { Meta } = Card;

interface AddCardProps {
  imageUrl: string;
  title: string;
}

const AddCard: React.FC<AddCardProps> = ({ imageUrl, title }) => {
  return (
    <Card
      className="custom-card"
      hoverable
      cover={<img alt="example" src={imageUrl} />}
    >
      <Meta title={title} />
    </Card>
  );
};

export default AddCard;
