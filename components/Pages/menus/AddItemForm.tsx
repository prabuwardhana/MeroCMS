import React from "react";

import PageItems from "./PageItems";
import CategoryItems from "./CategoryItems";
import CustomLinkItem from "./CustomLinkItem";
import SocialLinkItems from "./SocialLinkItems";

const AddItemForm = () => {
  return (
    <div className="bg-card">
      <PageItems />
      <CustomLinkItem />
      <CategoryItems />
      <SocialLinkItems />
    </div>
  );
};

export default AddItemForm;
