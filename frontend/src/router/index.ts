import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../components/MainView.vue';
import IssueView from '../components/IssueView.vue';
import GenerateFixView from '../components/GenerateFixView.vue';

const routes = [
  { path: '/', name: 'Home', component: MainView },
  { path: '/issues/:repoId', name: 'IssueView', component: IssueView },
    { path: '/generate-fix/:issueId', name: 'GenerateFix', component: GenerateFixView }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
