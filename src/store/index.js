import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

Vue.use(Vuex);

const bus = new Vue({});
const { GITHUB_OAUTH_TOKEN, GITHUB_ORG_NAME } = process.env;

// iss.attributes.isArchived = !!iss.attributes.repository.archived;
// iss.attributes.isPullRequest = !!iss.attributes.pull_request;
// iss.attributes.repo = iss.attributes.repository.name
// iss.attributes.htmlUrl = iss.attributes.html_url
//   {
//     title: 'fadgasd Dubbin',
//     repo: 'fd@geocities.com',
//     body: 'Mfsdfsfsfsdale',
//     friendlyCreatedAt: 'sometime ago',
//     friendlyUpdatedAt: 'sometime ago',
//     created_at: new Date(),
//     updated_at: new Date(),
//     url: 'https://google.com',
//     isArchived: false,
//     isPullRequest: false,
//   },
//   {
//     title: 'hsfd Dubbin',
//     repo: 'gdfg@geocities.com',
//     body: 'Masfdsfsfsfsle',
//     friendlyCreatedAt: 'some time ago',
//     friendlyUpdatedAt: 'some time ago',
//     created_at: new Date(),
//     updated_at: new Date(),
//     url: 'https://google.com',
//     isArchived: false,
//     isPullRequest: true,
//   },
//   {
//     title: 'fadgasd Dubbin',
//     repo: 'sfsdgd@geocities.com',
//     body: 'Mfsdfsfsfsdale',
//     friendlyCreatedAt: 'some time ago',
//     friendlyUpdatedAt: 'some time ago',
//     created_at: new Date(),
//     updated_at: new Date(),
//     url: 'https://google.com',
//     isArchived: false,
//     isPullRequest: false,
//   },
//   {
//     title: 'adsfew Dubbin',
//     repo: 'hhd@geocities.com',
//     body: 'Masfdsfsfsfsle',
//     friendlyCreatedAt: 'some time ago',
//     friendlyUpdatedAt: 'some time ago',
//     created_at: new Date(),
//     updated_at: new Date(),
//     url: 'https://google.com',
//     isArchived: false,
//     isPullRequest: true,
//   },

export default new Vuex.Store({
  state: {
    issues: [
    ],
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
      // console.log(model.length);
      // console.dir(model[0]);
      // console.dir(model[1]);
      state.issues = model.filter((c) => !c.isArchived);
      bus.$emit('ChangeView', 1000);
    },
  },
  actions: {
    async refreshIssues(context) {
      const issues = [];
      let link;
      let maxPages = 1;

      // eslint-disable-next-line consistent-return
      const fetchPage = async (page) => {
        console.dir(page);

        if (!page) { return null; }

        const params = {
          page,
          per_page: 100,
          filter: 'all',
          state: 'open',
        };

        const response = await axios.get(`https://api.github.com/orgs/${GITHUB_ORG_NAME}/issues`, {
          params,
          headers: {
            Authorization: `token ${GITHUB_OAUTH_TOKEN}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        });
        // console.dir(response);
        const batch = response.data;
        batch.forEach((ghi) => issues.push(ghi));
        if (page === 1) {
          // eslint-disable-next-line global-require
          link = require('parse-link-header')(response.headers.link);
          maxPages = Number(link.last.page);
        }
      };

      await fetchPage(1);
      for (let i = Number(link.next.page); i <= maxPages; i += 1) {
      // eslint-disable-next-line no-await-in-loop
        await fetchPage(i);
      }
      context.commit('updateIssues', issues);
    },
    // async refreshIssues(context) {
    //   const response = await axios.get(`https://api.github.com/orgs/${ORG_NAME}/issues`, {
    //     headers: {
    //       Authorization: `token ${TOKEN}`,
    //       Accept: 'application/vnd.github.machine-man-preview+json',
    //     },
    //   });
    //   context.commit('updateIssues', response.data);
    // },
  },
  // modules: {
  // },
});
