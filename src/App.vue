<template>
  <v-app id="app">
    <v-overlay
      v-if="loading"
    >
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
    </v-overlay>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            link
          >
            <v-select
              :items="orgs"
              v-model="currentOrg"
              hide-selected
              label="Select gazette"
              v-on:change="orgSelect"
            ></v-select>
          </v-list-item>

          <v-list-item
            v-for="item in nav.model"
            :key="item.title"
            link
            :href="item.link"
            target="_blank"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div>
        Vol. {{lenIssues + lenPrs}}</div>
      <v-spacer></v-spacer>
      <v-toolbar-title id="gazette-title">The {{currentOrg}} Git Gazette</v-toolbar-title>
      <v-spacer></v-spacer>
      {{ today }}
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>

    <v-footer
      :inset="footer.inset"
      app
    >
      <span class="px-4"></span>
    </v-footer>
  </v-app>
</template>

<script>
import store from './store';

export default {
  data: () => ({
    drawer: false,
    nav: {
      model: [
        {
          title: 'Auth/Re-auth',
          icon: 'mdi-account-key-outline',
          link: `https://github.com/login/oauth/authorize?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}`,
        },
      ],
    },
    footer: {
      inset: false,
    },
    currentOrg: localStorage.currentOrg,
  }),
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
    lenIssues: () => store.state.issues.filter((i) => !i.isPullRequest).length,
    lenPrs: () => store.state.issues.filter((i) => i.isPullRequest).length,
    orgs: () => JSON.parse(localStorage.orgs || '[]'),
    loading: () => store.state.loading,
  },
  methods: {
    orgSelect(org) {
      localStorage.currentOrg = org;
      window.location.reload();
    },
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#gazette-title {
  font-family: 'Bevan', cursive;
}
</style>
