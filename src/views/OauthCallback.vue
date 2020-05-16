<template>
  <div>Redirecting to frontpage...</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OauthCallback',
  async mounted() {
    const response = await axios.post(`${process.env.VUE_APP_GAZETTE_API_URL}/exchange`, {
      code: this.$route.query.code,
    });
    const asEntries = new URLSearchParams(response.data);
    // eslint-disable-next-line camelcase
    const { access_token } = Object.fromEntries(asEntries);
    // eslint-disable-next-line camelcase
    const accessToken = access_token;
    // eslint-disable-next-line camelcase
    localStorage.accessToken = access_token;

    const respInstallations = await axios.get('https://api.github.com/user/installations', {
      method: 'get',
      mode: 'cors',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.machine-man-preview+json',
      },
    });

    const orgs = respInstallations.data.installations
      .filter((f) => f.target_type === 'Organization').map((i) => i.account.login);
    localStorage.orgs = JSON.stringify(orgs);
    // eslint-disable-next-line prefer-destructuring
    localStorage.currentOrg = orgs[0];
    console.dir(`Storing org: ${orgs} ...`);

    window.location.replace('/');
  },
};
</script>
