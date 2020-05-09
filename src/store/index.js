import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

const parseLinkHeader = require('parse-link-header');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    issues: [],
    loading: false,
  },
  mutations: {
    updateIssues(state, payload) {
      const model = payload.map((p) => {
        const m = p;
        m.isArchived = !!p.repository.archived;
        m.isPullRequest = !!p.pull_request;
        m.repo = p.repository.name;
        m.url = p.html_url;
        m.friendlyCreatedAt = moment(p.created_at).fromNow();
        m.friendlyUpdatedAt = moment(p.updated_at).fromNow();
        return m;
      });
      state.issues = model.filter((c) => !c.isArchived);
      state.loading = false;
    },
    updateLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async refreshIssues(context) {
      context.commit('updateLoading', true);
      const issues = [];
      let link;
      let maxPages = 1;

      const fetchPage = async (page) => {
        const org = localStorage.currentOrg;
        const appToken = localStorage.accessToken;

        console.dir(`Fetching issues for ${org}, page ${page}...`);

        if (!page) { return null; }

        const params = {
          page,
          per_page: 100,
          filter: 'all',
          state: 'open',
        };

        const response = await axios.get(`https://api.github.com/orgs/${org}/issues`, {
          params,
          headers: {
            Authorization: `token ${appToken}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        });

        const batch = response.data;
        batch.forEach((ghi) => issues.push(ghi));
        if (page === 1) {
          link = parseLinkHeader(response.headers.link);
          maxPages = Number(link && link.last.page) || 1;
        }
      };

      await fetchPage(1);
      for (let i = (Number(link && link.next.page) || 2); i <= maxPages; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await fetchPage(i);
      }
      context.commit('updateIssues', issues);
    },
  },
});
