<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-layout md-gutter">
      <div class="md-layout-item">
        <md-table v-model="issues" :md-sort.sync="issuesSortBy"
        :md-sort-order.sync="issueSortOrder"
        :md-sort-fn="issuesSort" md-card>
          <md-table-toolbar>
            <h1 class="md-title">{{ issues.length }} Issues</h1>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Title" md-sort-by="title" @click.native="goto(item.url)">
              {{item.title}}</md-table-cell>
            <md-table-cell md-label="Repo" md-sort-by="body">{{ item.repo }}</md-table-cell>
            <md-table-cell md-label="Created@" md-sort-by="created_at">
              {{ item.friendlyCreatedAt }}</md-table-cell>
            <md-table-cell md-label="Updated@" md-sort-by="updated_at">
              {{ item.friendlyUpdatedAt }}</md-table-cell>
            <md-tooltip md-direction="right">{{item.body}}</md-tooltip>
          </md-table-row>
        </md-table>
      </div>
      <div class="md-layout-item">
        <md-table v-model="pullRequests" :md-sort.sync="prsSortBy"
        :md-sort-order.sync="prsSortOrder"
        :md-sort-fn="prsSort" md-card>
          <md-table-toolbar>
            <h1 class="md-title">{{ pullRequests.length }} Pull Requests</h1>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Title" md-sort-by="title" @click.native="goto(item.url)">
              {{item.title}}</md-table-cell>
            <md-table-cell md-label="Repo" md-sort-by="body">{{ item.repo }}</md-table-cell>
            <md-table-cell md-label="Created@" md-sort-by="created_at">
              {{ item.friendlyCreatedAt }}</md-table-cell>
            <md-table-cell md-label="Updated@" md-sort-by="updated_at">
              {{ item.friendlyUpdatedAt }}</md-table-cell>
            <md-tooltip md-direction="left">{{item.body}}</md-tooltip>
          </md-table-row>
        </md-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "~vue-material/src/theme/engine";

  .md-layout-item {
    height: 40px;

    &:after {
      width: 100%;
      height: 100%;
      display: block;
      // background: md-get-palette-color(red, 200);
      // content: " ";
    }

    &:nth-child(1) {
      background: md-get-palette-color(grey, 300);
    }

    &:nth-child(2) {
      background: md-get-palette-color(grey, 400);
    }

    &:nth-child(3) {
      background: md-get-palette-color(grey, 500);
    }
  }
</style>

<script>
import store from '../store';

export default {
  name: 'Frontpage',
  data: () => ({
    issuesSortBy: 'updated_at',
    issueSortOrder: 'asc',
    prsSortBy: 'updated_at',
    prsSortOrder: 'asc',
    issues: store.state.issues.filter((i) => !i.isPullRequest),
    pullRequests: store.state.issues.filter((i) => i.isPullRequest),
  }),
  created() {
    this.$store.dispatch('refreshIssues');
  },
  methods: {
    issuesSort(value) {
      return this.basesort(value, this.issuesSortBy, this.issueSortOrder);
    },
    prsSort(value) {
      return this.basesort(value, this.prsSortBy, this.prsSortOrder);
    },
    basesort(value, sortBy, sortOrder) {
      return value.sort((a, b) => {
        if (sortBy === 'created_at' || sortBy === 'updated_At') {
          const datesort = (aa, bb) => {
            const dateA = new Date(aa.callDateTime);
            const dateB = new Date(bb.callDateTime);

            if (sortOrder === 'asc') {
              return dateA >= dateB ? 1 : -1;
            }
            return dateA <= dateB ? 1 : -1;
          };
          return datesort(a, b);
        }

        if (sortOrder === 'desc') {
          return a[sortBy].localeCompare(b[sortBy]);
        }

        return b[sortBy].localeCompare(a[sortBy]);
      });
    },
    goto(url) {
      window.open(url);
    },
  },
  components: {
  },
};
</script>
