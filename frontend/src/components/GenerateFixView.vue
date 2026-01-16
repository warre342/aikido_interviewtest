<template>
  <div class="generate-fix-container">
    <button class="back-btn" @click="$router.back()">Back</button>
    <h2>Generate Fix</h2>

<h3>Original Code</h3>
<pre>{{ codeSnippet }}</pre>

<button
  v-if="!fixedCode"
  class="generate-btn"
  @click="generateFix"
  :disabled="loading"
>
  Generate Fix
</button>



    <div v-if="loading">Generating fix...</div>

    <div v-if="fixedCode">
      <h3>Fixed Code</h3>
      <pre>{{ fixedCode }}</pre>

      <h3>Diff</h3>
      <pre v-html="codeDiff"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { diffLines } from 'diff';
import { fetchCodeFix } from '../services/api';

const VULNERABLE_PHP_SNIPPET = `$domains = ['domain' => 'example.com'];
$first = \\\`dig @$ns_dig[0] -t ns $domains[domain]\\\`;
echo "<pre>$first</pre>";
$second = \\\`dig @$ns_dig[1] -t ns $domains[domain]\\\`;
echo "<pre>$second</pre>";`;

export default defineComponent({
  name: 'GenerateFixView',

  data() {
    return {
      codeSnippet: VULNERABLE_PHP_SNIPPET,
      fixedCode: '',
      codeDiff: '',
      loading: false
    };
  },

  methods: {
    escapeHtml(str: string) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },

    stripMarkdown(code: string) {
      return code
        .replace(/^```[\w]*\n?/gm, '')
        .replace(/```$/gm, '')
        .trim();
    },

    async generateFix() {
      this.loading = true;

      try {
        const response = await fetchCodeFix(
          this.codeSnippet,
          'php',
          'Using backticks in PHP can lead to remote code execution'
        );

        this.fixedCode = response.fixedCode;

        const cleanFixedCode = this.stripMarkdown(this.fixedCode);

        const diff = diffLines(this.codeSnippet, cleanFixedCode);

        this.codeDiff = diff
        .flatMap(part => {
            const lines = part.value.split('\n');

            return lines.map(line => {
            const escaped = this.escapeHtml(line);

            if (part.added) {
                return `<div class="diff-added">+ ${escaped}</div>`;
            }

            if (part.removed) {
                return `<div class="diff-removed">- ${escaped}</div>`;
            }

            return `<div class="diff-context">  ${escaped}</div>`;
            });
        })
        .join('');

      } catch (err) {
        console.error('Error generating fix:', err);
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped>
.generate-fix-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  text-align: left;
}

.back-btn,
.generate-btn {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn {
  background-color: #ddd;
}

.back-btn:hover {
  background-color: #bbb;
}

.generate-btn {
  background-color: #3498db;
  color: white;
}

.generate-btn:hover {
  background-color: #2980b9;
}

pre {
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
}

/* Diff colors */
pre span.diff-added {
  color: #2ecc71;
  background-color: #eaffea;
}

pre span.diff-removed {
  color: #e74c3c;
  background-color: #ffecec;
}

pre span.diff-context {
  color: #555;
}
</style>
