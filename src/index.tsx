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
} from '@apollo/client';
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
const GIT_USER = gql`
    query {
        user(login: "gaearon") {
            name
            url
            bio
            avatarUrl
            anyPinnableItems
            bioHTML
            company
            companyHTML
            email
            followers(first: 50) {
                nodes {
                    name
                    url
                }
            }
            following(first: 50) {
                nodes {
                    name
                    url
                }
            }
            starredRepositories(first: 50) {
                nodes {
                    name
                    url
                }
            }
            twitterUsername
            repositories(first: 50, isFork: false) {
                nodes {
                    name
                    url
                }
            }
        }
    }`;

function User() {
    const { loading, error, data } = useQuery(GIT_USER);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    const repos = <UserRepos repos={data.user.repositories.nodes}/>

    return (
        <>
            <picture>
                <img src={data.user.avatarUrl} alt="avatar" style={{ borderRadius: 230 }}/>
            </picture>
            <p> {data.user.name} </p>
            <p>{data.user.url.split('https://github.com/')[1]}</p>
            <input type="button" value="Follow"/>
            <div>
                <span> followers {data.user.followers.nodes.length}</span>
                <span> following {data.user.following.nodes.length}</span>
                <span> starred {data.user.starredRepositories.nodes.length}</span>
            </div>
            <p>{data.user.email}</p>
            <p>{data.user.twitterUsername}</p>
            <span> {repos} </span>
        </>
    );
}

function UserRepos(data: {repos: Array<any>}) {
    return (
        <>
            <span> repositories {data.repos.length}</span>
        </>
    );
}

ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={githubClient}>
        <User />
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
