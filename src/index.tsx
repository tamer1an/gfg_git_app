import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    createHttpLink,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = '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';
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
const githubClient = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

const GIT_ORG = gql`
    query {
        organization(login: "github-tools") {
            name
            url
        }
    }
`;

const GIT_USER = gql`
    query {
        user(login: "tamer1an") {
            name
            url
        }
    }
`;

function Organization() {
    const { loading, error, data } = useQuery(GIT_ORG);
    console.log(data)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <p>
                {data.organization.name}
            </p>
        </div>
    );
}

function User() {
    const { loading, error, data } = useQuery(GIT_USER);
    console.log(data)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <p>
                {data.user.name}
            </p>
        </div>
    );
}

ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={githubClient}>
        <User />
      </ApolloProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);
