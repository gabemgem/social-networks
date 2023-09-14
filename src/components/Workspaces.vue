<template>
    <WorkspaceContainer :workspaceId="selectedWorkspaceId"/>
    <v-btn @click="testOutput">TestWrapper</v-btn>
</template>

<script setup>
import WorkspaceContainer from './WorkspaceContainer.vue';
import { useWorkspacesStore } from '@/store/workspaces';
import { ref } from 'vue';

const store = useWorkspacesStore();
const selectedWorkspaceId = ref('testworkspace');

function testOutput() {
    console.log(store);
}

</script>