import React from "react";
import { Card, Button } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import "./CustomCard.css";

const { Meta } = Card;

interface CustomCardProps {
  imageUrl: string;
  title: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ imageUrl, title }) => {
  return (
    <Card
      className="custom-card"
      hoverable
      cover={<img alt="example" src={imageUrl} />}
      actions={[
        <Button icon={<HeartOutlined />} key="favorite">
          Favorite
        </Button>,
        <Button icon={<EyeOutlined />} key="view">
          View
        </Button>,
      ]}
    >
      <Meta title={title} />
    </Card>
  );
};

export default CustomCard;
