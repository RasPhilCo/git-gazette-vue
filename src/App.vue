<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/frontpage">Frontpage</router-link> -->
      <div class="md-display-3">
        The oclif Git Gazette
      </div>
    </div>
    <div class="line">
    </div>
    <div class="line line-bottom md-subheading">
      {{ today }}
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  computed: {
    today: () => {
      const date = new Date();
      const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      };
      const formatted = date.toLocaleString('en-us', options);
      return formatted;
    },
  },
  components: {
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.line {
  border-bottom: solid gray 1px;

}

.line-bottom {
  margin-bottom: 20px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
