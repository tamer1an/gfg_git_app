import {useQuery} from "@apollo/client";
import React from "react";
// @ts-expect-error
import { GIT_ORG } from './queries.ts';

function Organization() {
    const { data } = useQuery(GIT_ORG);

    return (
        <div>
            <p>
                {data.organization.name}
            </p>
        </div>
    );
}