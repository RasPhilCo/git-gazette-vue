<template>
  <div id="refreshIssues">
    <button v-on:click="refreshIssues">refreshIssues</button>
  </div>
</template>

<script>
import store from '../store';

export default {
  name: 'RefreshIssues',
  methods: {
    refreshIssues: () => {
      store.dispatch('refreshIssues');
    },
  },
};
</script>
