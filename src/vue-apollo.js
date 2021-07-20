import Vue from "vue";
import { ApolloClient } from "apollo-client";
import VueApollo from "vue-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";

import TodoFragment from "./graphql/todo.fragment.gql";

import typeDefs from "./graphql/typedefs.gql";

Vue.use(VueApollo);

const resolvers = {
  Query: {
    async users() {
      const rawUserData = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      ).then(r => r.json());

      return rawUserData.map(user => ({
        __typename: "ClientUser",
        ...user,
      }));
    },
    async todos() {
      const rawTodosData = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      ).then(r => r.json());

      return rawTodosData.map(user => ({
        __typename: "ClientTodo",
        ...user,
      }));
    },
    async todo(_, vars, { cache }) {
      const existingTodo = cache.readFragment({
        fragment: TodoFragment,
        id: `ClientTodo:${vars.id}`,
      });

      if (existingTodo) {
        return existingTodo;
      }

      const rawTodoData = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${vars.id}`
      ).then(r => r.json());

      return {
        __typename: "ClientTodo",
        ...rawTodoData,
      };
    },
  },
  ClientUser: {
    address(parent) {
      return {
        __typename: "ClientAddress",
        id: `address-${parent.id}`,
        ...parent.address,
      };
    },
  },
  ClientTodo: {
    async user(parent) {
      const rawUserData = await fetch(
        `https://jsonplaceholder.typicode.com/users/${parent.userId ||
          parent.id}`
      ).then(r => r.json());
      return {
        __typename: "ClientUser",
        ...rawUserData,
      };
    },
  },
};

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  resolvers,
  typeDefs,
});

export function createProvider() {
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  });

  return apolloProvider;
}
