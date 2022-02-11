import { gql } from "@apollo/client";

export const GIT_ORG = gql`
    query {
        organization(login: "github-tools") {
            name
            url
        }
    }
`;
export const GIT_USER = gql`
    query {
        user(login: "tamer1an") {
            name
            url
        }
    }
`;

export const GIT_USER_FULLINFO = gql`
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
            login
            
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
    }`