import React from 'react';
import ReactDOM from 'react-dom';
// import { Link, Route, Routes } from 'react-router-dom';
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
                <span>
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                         data-view-component="true" className="octicon octicon-people">
    <path d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
</svg>
                </span>
                <span> {data.user.followers.nodes.length}</span>
                <span className="lnk"> followers</span> ·
                <span>  {data.user.following.nodes.length}</span>
                <span className="lnk"> following</span> ·
                <span className="lnk"> <svg className="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1"
                                            width="16" height="16" aria-hidden="true"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg></span>
                <span>  {starsCount > 1000 ? `${(starsCount/1000)}K` : starsCount }</span>
            </div>
            <p className="lnk">{data.user.email}</p>
            <p className="lnk">
                <svg
                    style={{ width: 16 }}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" role="img"
                     aria-labelledby="8indi9kq1pzo7vvkg27n2srel71f07p" className="octicon"><title
                    id="8indi9kq1pzo7vvkg27n2srel71f07p">Twitter</title>
                    <path
                        d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
                        fill="currentColor"></path>
                </svg>{data.user.twitterUsername}</p>
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
          <section className="App">
              <User />
          </section>
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
