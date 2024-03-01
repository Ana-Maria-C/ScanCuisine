import React from "react";
import { Card, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./UserCard.css";

const { Meta } = Card;

interface UserCardProps {
  imageUrl: string;
  title: string;
}

const UserCard: React.FC<UserCardProps> = ({ imageUrl, title }) => {
  return (
    <Card
      className="custom-card"
      hoverable
      cover={<img alt="example" src={imageUrl} />}
      actions={[
        <Button icon={<EyeOutlined />} key="view">
          View Profile
        </Button>,
      ]}
    >
      <Meta title={title} />
    </Card>
  );
};

export default UserCard;
