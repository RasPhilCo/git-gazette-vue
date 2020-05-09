<template>
  <v-row class="mb-6">
    <v-col>
      <v-card-title>
        Issues ({{issues.length}})

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
      >
        <template v-slot:item.title="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">{{item.title}}</span>
            </template>
            <span>{{item.body}}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>

    <v-col>
      <v-card-title>
        Pull Requests ({{prs.length}})
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
      >
        <template v-slot:item.title="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">{{item.title}}</span>
            </template>
            <span>{{item.body}}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import store from '../store';

export default {
  name: 'Frontpage',
  data() {
    return {
      pagination: {
        rowsPerPageItems: [30, 100],
        rowsPerPage: 30,
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
          sort: this.dateSort,
        },
        {
          text: 'Updated@',
          value: 'friendlyUpdatedAt',
          sort: this.dateSort,
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
    datesort(value, sortBy, isDesc) {
      return value.sort((a, b) => {
        const dateA = new Date(a.callDateTime);
        const dateB = new Date(b.callDateTime);

        if (!isDesc) {
          return dateA >= dateB ? 1 : -1;
        }
        return dateA <= dateB ? 1 : -1;
      });
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
