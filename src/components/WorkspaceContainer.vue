<!-- Component to contain a workspace. Besides the workspace component,
this will have the workspace settings/editing stuff. Settings include: 
- where the data comes from 
- general notes about the workspace 
- whether to show additional data besides the network (probably graphs)
- node properties (color, size, etc.)
- link properties (color, direction?, pull strength?) -->

<template>
  <template v-if="store.selectedWorkspaceId">
    <v-tabs v-model="tab">
      <v-tab value="overview">Overview</v-tab>
      <v-tab value="settings">Settings</v-tab>
      <v-tab value="network">Network</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="overview">
        <WorkspaceOverview :settings="workspaceSettings" :data="data" />
      </v-window-item>
      <v-window-item value="settings">
        <WorkspaceSettings @saved="settingsSaved"> </WorkspaceSettings>
      </v-window-item>

      <v-window-item value="network"
        ><Workspace :settings="workspaceSettings" :data="data" />
      </v-window-item>
    </v-window>
    <v-btn @click="testOutput">TestCont</v-btn>
  </template>
</template>

<script setup>
import { watch } from "vue";
import Workspace from "./Workspace.vue";
import WorkspaceSettings from "./WorkspaceSettings.vue";
import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { onMounted } from "vue";
import { useWorkspacesStore } from "@/store/workspaces";
import WorkspaceOverview from "./WorkspaceOverview.vue";

onMounted(() => {
  if (store.selectedWorkspaceId) {
    loadWorkspace();
  }
});

const store = useWorkspacesStore();

watch(
  () => store.selectedWorkspaceId,
  () => loadWorkspace(),
);

function saveWorkspace() {
  store.workspaces[store.selectedWorkspaceId] = {
    settings: workspaceSettings.value,
    data: data.value,
  };
}
function loadWorkspace() {
  const initialWorkspaceValues = store.getWorkspace(store.selectedWorkspaceId);
  workspaceName.value = initialWorkspaceValues.settings.workspacename;
  workspaceSettings.value = initialWorkspaceValues.settings;
  data.value = initialWorkspaceValues.data;
  cleanSavedData();
}

function testOutput() {
  console.log(workspaceSettings.value);
  console.log(data.value);
}

const tab = ref(null);

const workspaceName = ref("Test Workspace");

const workspaceSettings = ref({
  workspaceid: store.selectedWorkspaceId,
  workspacename: workspaceName.value,
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
});

const data = ref(null);

function cleanSavedData() {
  if (data.value && data.value.links) {
    data.value.links.forEach((l) => {
      l.source = l.source.id || l.source;
      l.target = l.target.id || l.target;
    });
  }
}

function settingsSaved(settings, graphData, dataChanged) {
  if (dataChanged) {
    data.value = graphData;
  }

  if (settings.notes.changed) {
    workspaceSettings.value.notes = settings.notes.value;
  }

  if (settings.nodecolor.changed) {
    workspaceSettings.value.nodecolor = settings.nodecolor.value;
    updateNodeColor();
  }

  if (
    settings.nodesize.changed ||
    settings.nodesizemax.changed ||
    settings.nodesizemin.changed
  ) {
    workspaceSettings.value.nodesize = settings.nodesize.value;
    workspaceSettings.value.nodesizemax = settings.nodesizemax.value;
    workspaceSettings.value.nodesizemin = settings.nodesizemin.value;
    updateNodeSize();
  }

  if (settings.nodelabel.changed) {
    workspaceSettings.value.nodelabel = settings.nodelabel.value;
  }

  if (settings.linklabel.changed) {
    workspaceSettings.value.linklabel = settings.linklabel.value;
  }

  if (settings.linkcolor.changed) {
    workspaceSettings.value.linkcolor = settings.linkcolor.value;
    updateLinkColor();
  }

  if (settings.linkwidth.changed || settings.linkwidthmax.changed) {
    workspaceSettings.value.linkwidth = settings.linkwidth.value;
    workspaceSettings.value.linkwidthmax = settings.linkwidthmax.value;
    updateLinkWidth();
  }

  if (settings.directionallinks.changed) {
    workspaceSettings.value.directionallinks = settings.directionallinks.value;
  }

  saveWorkspace();
  workspaceSettings.value.updatetoggle = !workspaceSettings.value.updatetoggle;
}

function updateLinkWidth() {
  const linkVal = workspaceSettings.value.linkwidth;
  const linkMax = workspaceSettings.value.linkwidthmax;
  const linkMin = 1;
  const newRange = linkMax - linkMin;

  const oldMax = Math.max(data.value.links[linkVal]);
  const oldMin = Math.min(data.value.links[linkVal]);
  const oldRange = oldMax - oldMin;

  data.value.links.forEach((l) => {
    const percent = (l[linkVal] - oldMin) / oldRange;
    const newVal = percent * newRange + linkMin;

    l[`new${linkVal}`] = newVal;
  });
  workspaceSettings.value.linkwidth = `new${linkVal}`;
}

function updateLinkColor() {
  const newValue = workspaceSettings.value.linkcolor;
  if (newValue !== "") {
    const possibleValues = Array.from(
      new Set(data.value.links.map((l) => l[newValue])),
    );
    const colorMap = {};
    for (let i = 1; i <= possibleValues.length; i++) {
      colorMap[possibleValues[i - 1]] = selectColor(i);
    }
    data.value.links.forEach((l) => {
      l[`new${newValue}`] = colorMap[l[newValue]];
    });
    workspaceSettings.value.linkcolor = `new${newValue}`;
  }
}

function updateNodeColor() {
  const newValue = workspaceSettings.value.nodecolor;
  if (newValue !== "") {
    const possibleValues = Array.from(
      new Set(data.value.nodes.map((n) => n[newValue])),
    );
    const colorMap = {};
    for (let i = 1; i <= possibleValues.length; i++) {
      colorMap[possibleValues[i - 1]] = selectColor(i);
    }
    data.value.nodes.forEach((n) => {
      n[`new${newValue}`] = colorMap[n[newValue]];
    });
    workspaceSettings.value.nodecolor = `new${newValue}`;
  }
}

function updateNodeSize() {
  const nodeVal = workspaceSettings.value.nodesize;
  const nodeMax = workspaceSettings.value.nodesizemax;
  const nodeMin = workspaceSettings.value.nodesizemin;
  const newRange = nodeMax - nodeMin;

  const oldMax = Math.max(data.value.nodes[nodeVal]);
  const oldMin = Math.min(data.value.nodes[nodeVal]);
  const oldRange = oldMax - oldMin;

  data.value.nodes.forEach((n) => {
    const percent = (n[nodeVal] - oldMin) / oldRange;
    const newVal = percent * newRange + nodeMin;

    n[`new${nodeVal}`] = newVal;
  });
  workspaceSettings.value.nodesize = `new${nodeVal}`;
}

function selectColor(number) {
  const hue = number * 137.508; // golden angle approximation
  return `hsl(${hue},50%,75%)`;
}
</script>
