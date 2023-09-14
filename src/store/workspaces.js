import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";
import { v4 as uuidv4 } from "uuid";

export const useWorkspacesStore = defineStore("workspacesstore", () => {
  const workspaces = useLocalStorage("workspaces", {});
  const selectedWorkspaceId = useLocalStorage("selected_workspace_id", null);

  const selectedWorkspace = computed(
    () => workspaces.value[selectedWorkspaceId.value],
  );

  const workspaceNames = computed(() => {
    return Object.keys(workspaces.value).map((k) => {
      return {
        workspaceid: k,
        workspacename: workspaces.value[k].settings.workspacename,
      };
    });
  });

  function setSelectedWorkspace(workspaceId) {
    selectedWorkspaceId.value = workspaceId;
  }

  function getWorkspace(workspaceId) {
    return workspaceId in workspaces.value
      ? workspaces.value[workspaceId]
      : null;
  }

  function createNewWorkspace(workspaceName) {
    const newId = uuidv4();
    const settings = {
      workspaceid: newId,
      workspacename: workspaceName,
      notes: null,
      nodecolor: "color",
      nodesize: "val",
      nodesizemax: 1,
      nodesizemin: 1,
      nodelabel: "name",
      linklabel: "name",
      linkcolor: "color",
      linkwidth: 1,
      linkwidthmax: 1,
      directionallinks: false,
      updatetoggle: false,
    };
    const data = { nodes: [], links: [] };

    workspaces.value[newId] = { settings, data };

    return newId;
  }

  return {
    workspaces,
    selectedWorkspaceId,
    selectedWorkspace,
    setSelectedWorkspace,
    getWorkspace,
    createNewWorkspace,
    workspaceNames,
  };
});
