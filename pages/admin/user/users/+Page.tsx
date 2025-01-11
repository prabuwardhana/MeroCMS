export default Page;
import React from "react";
import { Users } from "../Users";

function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">All Users</h1>

      <Users />
    </>
  );
}
