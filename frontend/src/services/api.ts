import axios from 'axios';

// Base URL of your backend
const API_BASE = 'http://localhost:3000/api';

export async function getRepositories() {
  try {
    const response = await axios.get(`${API_BASE}/repos`);
    return response.data;
  } catch (err) {
    console.error('Error fetching repositories:', err);
    return [];
  }
}

export async function fetchIssuesForRepo(repoId: number){
  try {
    const response = await axios.get(`${API_BASE}/issues/${repoId}`);
    return response.data;
  } catch (err: any) {
    console.error(`Error fetching issues for repo ${repoId}:`, err);
    return [];
  }
}

export async function fetchCodeFix(
  code: string,
  language: string = 'php',
  issue: string = 'Using backticks in PHP can lead to remote code execution'
) {
  try {
    const response = await axios.get(`${API_BASE}/fix`, {
      params: { code, language, issue },
    });
    console.log(response)
    return response.data; // returns string
  } catch (err: any) {
    console.error('Error fetching code fix:', err);
    return null;
  }
}