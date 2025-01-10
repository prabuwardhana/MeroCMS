export default Page;
import React from "react";
// import { useData } from "vike-react/useData";
// import type { Data } from "./+data";
import { Users } from "./Users";

/**
 * Render all the products fetched in the +data.ts file.
 */
function Page() {
  // const { usersData } = useData<Data>();

  return (
    <>
      <h1 className="text-3xl font-bold underline">Fetching Users</h1>

      <Users />
    </>
  );
}
