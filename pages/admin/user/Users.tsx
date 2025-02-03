import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { withFallback } from "vike-react-query";
import { Config } from "vike-react/Config";
import { Head } from "vike-react/Head";
import { User } from "@/lib/types";
import API from "@/config/apiClient";

const Users = withFallback(
  () => {
    const { data: users } = useSuspenseQuery({
      queryKey: ["users"],
      queryFn: async () => {
        return await API.get<User[]>("/api/user/all");
      },
      staleTime: 60 * 1000,
    });

    return (
      <>
        <Config title={`${users.data.length} users`} />
        <Head>
          <meta name="description" content={`List of ${users.data.length} users.`} />
        </Head>
        <div>
          {users.data.map(({ email }: User) => (
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
