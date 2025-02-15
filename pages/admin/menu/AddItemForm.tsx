import React from "react";

import PageItems from "./PageItems";
import CategoryItems from "./CategoryItems";
import CustomLinkItem from "./CustomLinkItem";

const AddItemForm = () => {
  return (
    <div className="bg-card border">
      <PageItems />
      <CustomLinkItem />
      <CategoryItems />
    </div>
  );
};

export default AddItemForm;
