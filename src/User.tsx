import { useQuery } from "@apollo/client";
import React from "react";
// @ts-expect-error
import { GIT_USER_FULLINFO } from './queries.ts';

export function User() {
    const { data } = useQuery(GIT_USER_FULLINFO);
    console.log(data)

    return (
        <div>
            <p>
                {data.user.name}
            </p>
        </div>
    );
}