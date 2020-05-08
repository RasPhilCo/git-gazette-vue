<template>
  <v-app id="sandbox">
     <!-- <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      app
      overflow
    ></v-navigation-drawer> -->

    <v-app-bar :clipped-left="primaryDrawer.clipped" app>
      <!-- <v-app-bar-nav-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      ></v-app-bar-nav-icon> -->
      <div>
        Vol. {{lenIssues + lenPrs}}</div>
      <v-spacer></v-spacer>
      <v-toolbar-title id="gazette-title">The oclif Git Gazette</v-toolbar-title>
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
    drawers: ['Default (no property)', 'Permanent', 'Temporary'],
    primaryDrawer: {
      model: null,
      type: 'default (no property)',
      clipped: false,
      floating: false,
      mini: false,
    },
    footer: {
      inset: false,
    },
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
