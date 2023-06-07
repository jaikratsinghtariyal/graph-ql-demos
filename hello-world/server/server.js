import {ApolloServer} from '@apollo/server'
import {startStandaloneServer } from '@apollo/server/standalone'


const typeDefs = `#graphql
    type Query {
        greeting: String
    }
`;

const resolvers = {
    Query :{
        greeting: () => "Hello World New", 
    },
};

const server = new ApolloServer({typeDefs, resolvers});
//const info = await startStandaloneServer(server, {listen : {port : 9000}});
const {url} = await startStandaloneServer(server, {listen : {port : 9000}});


//console.log(`server running at ${info.url}`);
console.log(`server running at ${url}`);
