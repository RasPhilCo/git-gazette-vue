<template>
  <v-row class="mb-6">
    <v-col>
      <v-card-title>
        Issues ({{issues.length}} open)

        <v-spacer></v-spacer>

        <v-text-field
          v-model="issuesSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="issues"
        item-key="name"
        class="elevation-1"
        :search="issuesSearch"
        :custom-filter="issuesFilter"
        :footer-props="{
          'items-per-page-options': pagination.rowsPerPageItems
        }"
        :items-per-page="pagination.rowsPerPage"
        @click:row="goto"
        :sort-by="['friendlyUpdatedAt']"
        :sort-desc="[true]"
        :custom-sort="customSort"
      >
        <template v-slot:item.title="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on" class="purple-text">{{item.title}}</span>
            </template>
            <span>{{item.body}}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>

    <v-col>
      <v-card-title>
        Pull Requests ({{prs.length}} open)
        <v-spacer></v-spacer>
        <v-text-field
          v-model="prsSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="prs"
        item-key="name"
        class="elevation-1"
        :search="prsSearch"
        :custom-filter="prsFilter"
        :footer-props="{
          'items-per-page-options': pagination.rowsPerPageItems
        }"
        :items-per-page="pagination.rowsPerPage"
        @click:row="goto"
        :sort-by="['friendlyUpdatedAt']"
        :sort-desc="[true]"
        :custom-sort="customSort"
      >
        <template v-slot:item.title="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on" class="purple-text">{{item.title}}</span>
            </template>
            <span>{{item.body}}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<style>
.purple-text {
  color: purple;
}
</style>

<script>
import store from '../store';

export default {
  name: 'Frontpage',
  data() {
    return {
      pagination: {
        rowsPerPageItems: [50, 100],
        rowsPerPage: 50,
      },
      issuesSearch: '',
      prsSearch: '',
      issues: [],
      prs: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'Title',
          align: 'start',
          value: 'title',
        },
        {
          text: 'Repo',
          value: 'repo',
        },
        {
          text: 'Created@',
          value: 'friendlyCreatedAt',
        },
        {
          text: 'Updated@',
          value: 'friendlyUpdatedAt',
        },
      ];
    },
  },
  mounted() {
    this.$store.dispatch('refreshIssues')
      .then(() => {
        this.issues = store.state.issues.filter((i) => !i.isPullRequest);
        this.prs = store.state.issues.filter((i) => i.isPullRequest);
      });
  },
  methods: {
    customSort(items, index, isDesc) {
      // only single sort supported for now
      const i = index[0];
      const desc = isDesc[0];
      const sorted = items.sort((a, b) => {
        if (i === 'friendlyCreatedAt' || i === 'friendlyUpdatedAt') {
          const key = i === 'friendlyCreatedAt' ? 'created_at' : 'updated_at';
          const dateA = new Date(a[key]);
          const dateB = new Date(b[key]);

          if (!desc) {
            return dateA >= dateB ? 1 : -1;
          }
          // else
          return dateA <= dateB ? 1 : -1;
        }
        // else
        if (!desc) {
          return a[i] < b[i] ? -1 : 1;
        }
        // else
        return b[i] < a[i] ? -1 : 1;
      });
      return sorted;
    },
    issuesFilter(value, search) {
      return this.sharedSearch(value, search);
    },
    prsFilter(value, search) {
      return this.sharedSearch(value, search);
    },
    sharedSearch(value, search) {
      return (
        value != null
        && search != null
        && typeof value === 'string'
        && value
          .toString()
          .toLowerCase()
          .indexOf(search) !== -1
      );
    },
    goto(row) {
      window.open(row.url);
    },
  },
};
</script>
