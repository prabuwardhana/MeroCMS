import React from "react";

import CategoryItems from "./CategoryItems";
import CustomLinkItem from "./CustomLinkItem";

const AddItemForm = () => {
  return (
    <div className="bg-background border">
      <CustomLinkItem />
      <CategoryItems />
    </div>
  );
};

export default AddItemForm;
