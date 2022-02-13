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
import { svgEmail, svgFollowers, svgStars, svgTwitter } from "./svgs";
// import AppWrapper from "./App";

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});
const authLink = setContext((_, { headers }) => {
    const token = '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';
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
const USERNAME = new URLSearchParams(globalThis.location.search).get('username');
const GIT_USER = gql`
    query {
        user(login: "${USERNAME}") {
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
            repositories(first: 100, isFork: false) {
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
    const stars = data.user.starredRepositories.nodes;
    const starsCount = stars.length;

    return (
        <>
            <picture style={{ display: 'flex' }}>
                <img src={data.user.avatarUrl} alt="avatar" style={{ borderRadius: 230, margin: '0 auto' }}/>
            </picture>
            <div className="App__name"> {data.user.name} </div>
            <div className="App__username">{data.user.url.split('https://github.com/')[1]}</div>
            <p>
                <input className="btn" type="button" value="Follow"/>
            </p>
            <div>
                <span> {svgFollowers} </span>
                <span> {data.user.followers.nodes.length}</span>
                <span className="lnk"> followers</span> ·
                <span>  {data.user.following.nodes.length}</span>
                <span className="lnk"> following</span> ·
                <span className="lnk"> {svgStars}</span>
                <span>  {starsCount > 1000 ? `${(starsCount/1000)}K` : starsCount }</span>
            </div>
            <p className="lnk"> {svgEmail} {data.user.email}</p>
            {data.user.twitterUsername ? <p className="lnk">
                {svgTwitter}
                {data.user.twitterUsername}</p> : null}
            <span> {repos} </span>
        </>
    );
}

function UserRepos(data: {repos: Array<any>}) {
    console.log(data)
    return (
        <>
            <span> {data.repos.length} repositories </span>
            <ul className="App__repos">
                {data.repos.map((v, k) => {
                    return <div key={k}>{v.name}</div>
                })}
            </ul>
        </>
    );
}

ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={githubClient}>
          <section className="App">
              <User />
          </section>
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
