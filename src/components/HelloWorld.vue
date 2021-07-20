<template>
  <div>
    <input type="number" v-model="id" />
    <div v-if="$apollo.queries.todo.loading">Loading 1 todo...</div>
    <div v-else>{{ todo }}</div>

    <hr />
    <hr />
    <hr />

    <div v-if="$apollo.queries.todos.loading">Loading...</div>
    <ul v-else>
      <li v-for="todoItem in todos" :key="todoItem.id">
        {{ todoItem.id }} {{ todoItem.title }}
        <ul>
          <li>{{ todoItem.user.name }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import todosListQuery from "../graphql/todosList.query.gql";
import todoQuery from "../graphql/todo.query.gql";

export default {
  name: "HelloWorld",
  data() {
    return {
      id: 1,
    };
  },
  apollo: {
    todos: {
      query: todosListQuery,
    },
    todo: {
      query: todoQuery,
      variables() {
        return {
          id: this.id,
        };
      },
    },
  },
};
</script>
