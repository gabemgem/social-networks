import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { ref, computed } from "vue";


export const useWorkspacesStore = defineStore('workspacesstore', () => {
        const workspaces = useLocalStorage('workspaces', {});
        const selectedWorkspaceId = useLocalStorage('selected_workspace_id', null);

        const selectedWorkspace = computed(
            () => workspaces.value[selectedWorkspaceId.value]
            );

        function setSelectedWorkspace(workspaceId) {
            selectedWorkspaceId.value = workspaceId;
        }

        function getWorkspace(workspaceId) {
            return (workspaceId in workspaces.value) ? workspaces.value[workspaceId] : null;
        }

        return { 
            workspaces, 
            selectedWorkspaceId, 
            selectedWorkspace, 
            setSelectedWorkspace,
            getWorkspace, 
        }
    })