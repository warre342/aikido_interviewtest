<template>
  <div class="issues-container">
    <button class="back-btn" @click="$router.back()">← Back</button>
    <h2>Issues for Repo ID: {{ repoId }}</h2>

    <div v-if="loading" class="loading">Loading issues...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && issues.length > 0" class="issues-list">
      <div
        v-for="issue in issues"
        :key="issue.id"
        class="issue-card"
        :class="severityClass(issue.severity)"
      >
        <div class="issue-header">
          <h3>{{ issue.rule }}</h3>
          <span class="issue-type">{{ issue.type.toUpperCase() }}</span>
        </div>

        <div class="issue-body">
          <p><strong>Severity:</strong> <span :class="severityClass(issue.severity)">{{ issue.severity }}</span></p>
          <p><strong>Status:</strong> {{ issue.status }}</p>
          <p v-if="issue.affected_file"><strong>File:</strong> {{ issue.affected_file }}</p>
          <p v-if="issue.affected_package"><strong>Package:</strong> {{ issue.affected_package }}</p>
          <p><strong>First detected:</strong> {{ formatTimestamp(issue.first_detected_at) }}</p>
        </div>
                <!-- Show Fix button only for backtick PHP issues -->
        <button
            v-if="issue.rule && issue.rule.includes('backticks in PHP')"
          class="fix-btn"
          @click="goToGenerateFix(issue)"
        >
          Suggest Fix
        </button>
      </div>
      
    </div>

    <p v-if="!loading && issues.length === 0" class="no-issues">No issues found for this repository.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fetchIssuesForRepo } from '../services/api.ts';
import './IssuesView.scss'; // <-- import the SCSS file

export default defineComponent({
  name: 'IssuesView',
  data() {
    return {
      repoId: null as number | null,
      issues: [] as any[],
      loading: false,
      error: null as string | null
    };
  },
  mounted() {
    this.repoId = Number(this.$route.params.repoId);
    if (this.repoId) this.loadIssues();
  },
  methods: {
    async loadIssues() {
      this.loading = true;
      this.error = null;
      try {
        this.issues = await fetchIssuesForRepo(this.repoId!);
      } catch (err: any) {
        this.error = 'Failed to load issues';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    formatTimestamp(ts: number) {
      return ts ? new Date(ts * 1000).toLocaleString() : 'N/A';
    },
    severityClass(severity: string) {
      switch (severity.toLowerCase()) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'medium': return 'medium';
        case 'low': return 'low';
        default: return '';
      }
    },
    goToGenerateFix(issue: any) {
      // Pass issue object (or only code snippet) via router
      this.$router.push({ 
        name: 'GenerateFix', 
        params: { issueId: issue.id },
      });
    }


  }
});
</script>
