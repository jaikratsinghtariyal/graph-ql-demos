import {GraphQLClient} from 'graphql-request'
import {getAccessToken} from '../auth'
import {ApolloClient, ApolloLink, createHttpLink, concat, gql, InMemoryCache} from '@apollo/client'


const client = new GraphQLClient('http://localhost:9000/graphql', {
    headers: () => {
        const token = getAccessToken();
        if (token){
            return {'Authorization' : `Bearer ${token}`};
        }
        return {};
    },
});

const httpLink = createHttpLink({
    uri: 'http://localhost:9000/graphql'
})

const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token){
        operation.setContext({
            headers: {'Authorization' : `Bearer ${token}`}
        })
    }
    return forward(operation);
});

const apolloClient = new ApolloClient({
    // uri: "http://localhost:9000/graphql",
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: 'network-only'
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only'
    //     }
    // }
});

const jobByIdragment = gql`
    fragment JobDetail on job{
        id
        date
        company{
            id
            name
        }
        title
        description
    }  
`;
const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            id
            date
            company{
                id
                name
            }
            title
            description
        }
    }
`;

export async function createdJob({title, description}){
    const mutation = gql`
        mutation CreatedJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                id
            }
        }
    `;
    // const {job} = await client.request(mutation, {input: {title, description},});
    const {data} = await apolloClient.mutate({
        mutation, 
        variables: {input : {title, description}}
    });
    return data.job;
    // return job;
}

export async function getCompany(id) {
    const query = gql`
        query($id: ID!){
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                }
            }
        }  
    `
    // const {company} = await client.request(query, {id})
    const {data} = await apolloClient.query({
        query, 
        variables: {id}
    });
    return data.company
}

export async function getJob(id) {

    const query = gql`
        query($id: ID!) {
            job(id: $id) {
                id
                date
                company{
                    id
                    name
                }
                title
                description
            }
        }
    `;

    //const {job} = await client.request(query, {id})
    const {data} = await apolloClient.query({
        query, 
        variables: {id}
    });
    return data.job
}

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }
    `;

    // const {jobs} = await client.request(query)
    // return jobs;

    const {data} = await apolloClient.query({
        query,
        fetchPolicy: 'network-only'
    });
    return data.jobs
}