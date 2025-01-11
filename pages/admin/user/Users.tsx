import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { withFallback } from "vike-react-query";
import { Config } from "vike-react/Config";
import { Head } from "vike-react/Head";
import { User } from "./types";
import API from "@/config/apiClient";

const Users = withFallback(
  () => {
    const { data } = useSuspenseQuery({
      queryKey: ["users"],
      queryFn: async () => {
        return await API.get("/api/user/all");
      },
      staleTime: 60 * 1000,
    });

    const users = data as unknown;

    return (
      <>
        <Config title={`${(users as User[]).length} users`} />
        <Head>
          <meta name="description" content={`List of ${(users as User[]).length} users.`} />
        </Head>
        <div>
          {(users as User[]).map(({ email }: User) => (
            <ul key={email}>
              <li className="capitalize">Email: {email}</li>
            </ul>
          ))}
        </div>
      </>
    );
  },
  () => <div>Loading users...</div>,
  // The props `retry` and `error` are provided by vike-react-query
  ({ retry, error }) => (
    <div>
      <div>Failed to load Users: {error.message}</div>
      <button onClick={() => retry()}>Retry</button>
    </div>
  ),
);

export { Users };
