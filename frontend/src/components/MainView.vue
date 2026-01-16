<template>
  <div>
        <h2>View Active Repo's</h2>

    <button @click="fetchRepos" style="margin-bottom: 1rem;">Refresh</button>

    <div v-if="loading">Loading...</div>
    <div v-if="error" style="color: red">{{ error }}</div>

    <div v-for="repo in repos" :key="repo.id" class="repo-card">
      <h3>{{ repo.name }}</h3>
      <p>Last scanned at: {{ repo.last_scanned_at }}</p>
      <button @click="viewIssues(repo)">View Issues</button>
    
    </div>

    <p v-if="!loading && repos.length === 0">No active repositories found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getRepositories } from '../services/api.ts';

export default defineComponent({
  name: 'MainView',
  data() {
    return {
      repos: [] as any[],
      loading: false,
      error: null as string | null
    };
  },
  methods: {
    async fetchRepos() {
      this.loading = true;
      this.error = null;
      try {
        const allRepos = await getRepositories();
        // Filter only active repos and format timestamp
        this.repos = allRepos
          .filter(r => r.active)
          .map(r => ({
            ...r,
            last_scanned_at: new Date(r.last_scanned_at * 1000).toLocaleString()
          }));
      } catch (err) {
        this.error = 'Failed to fetch repositories';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    viewIssues(repo: any) {
      (this as any).$router.push({ name: 'IssueView', params: { repoId: repo.id } });
    }

  },
  mounted() {
    this.fetchRepos(); // request repos on page load
  }
});
</script>

<style scoped>
.repo-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
}
</style>
