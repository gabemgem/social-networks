<!-- Component to contain a workspace. Besides the workspace component,
this will have the workspace settings/editing stuff. Settings include: 
- where the data comes from 
- general notes about the workspace 
- whether to show additional data besides the network (probably graphs)
- node properties (color, size, etc.)
- link properties (color, direction?, pull strength?) -->

<template>
    <v-tabs v-model="tab">
        <v-tab value="settings">Settings</v-tab>
        <v-tab value="network">Network</v-tab>
    </v-tabs>

    <v-window v-model="tab">
        <v-window-item value="settings">
            <WorkspaceSettings
                @saved="settingsSaved"
            >
            </WorkspaceSettings>
        </v-window-item>
        
        <v-window-item value="network"><Workspace :settings="graphSettings" :data="data" :id="workspaceId"/>
        </v-window-item>
    </v-window>
    <v-btn @click="testOutput">TestCont</v-btn>
</template>

<script setup>
import { watch } from 'vue';
import Workspace from './Workspace.vue';
import WorkspaceSettings from './WorkspaceSettings.vue';
import { ref } from 'vue';

function testOutput() {
    console.log(workspaceSettings.value);
    console.log(graphSettings.value);
}

const tab = ref(null);

const workspaceId = ref('testworkspace');
const workspaceName = ref('Test Workspace');

const graphSettings = ref({
    workspaceid: workspaceId.value,
    nodecolor: null,
    nodesize: null,
    nodelabel: null,
    linklabel: null,
    linkcolor: null,
    linkwidth: null,
    directionallinks: false,
});
const workspaceSettings = ref(null);

const data = ref({
    nodes: [],
    links: []
});

function settingsSaved(settings, graphData) {
    data.value = graphData;
    workspaceSettings.value = settings;
}

// update graph settings
watch(workspaceId, () => graphSettings.value.workspaceid = workspaceId.value);
watch(
    () => workspaceSettings.value?.nodecolor.value,
    (newValue) => {
        if(newValue !== '') {
            const possibleValues = Array.from(new Set(data.value.nodes.map((n) => n[newValue])));
            const colorMap = {};
            for(let i=1; i<=possibleValues.size; i++) {
                colorMap[possibleValues[i-1]] = selectColor(i);
            }
            data.value.nodes.forEach((n) => {
                n[`new${newValue}`] = colorMap[n[newValue]];
            });
            graphSettings.value.nodecolor = `new${newValue}`;
        }
    }
);
watch(
    () => workspaceSettings.value?.nodesize.value,
    () => {
        updateNodeSize();
    }
);
watch(
    () => workspaceSettings.value?.nodesizemax.value,
    () => {
        updateNodeSize();
    }
);
watch(
    () => workspaceSettings.value?.nodesizemin.value,
    () => {
        updateNodeSize();
    }
);
function updateNodeSize() {
    const nodeVal = workspaceSettings.value?.nodesize.value;
    const nodeMax = workspaceSettings.value?.nodesizemax.value;
    const nodeMin = workspaceSettings.value?.nodesizemin.value;
    const newRange = nodeMax-nodeMin;

    const oldMax = Math.max(data.value.nodes[nodeVal]);
    const oldMin = Math.min(data.value.nodes[nodeVal]);
    const oldRange = oldMax-oldMin;

    data.value.nodes.forEach((n) => {
        const percent = (n[nodeVal] - oldMin) / oldRange;
        const newVal = (percent * newRange) + nodeMin;

        n[`new${nodeVal}`] = newVal;
    });
    graphSettings.value.nodesize = `new${nodeVal}`;
}
watch(
    () => workspaceSettings.value?.nodelabel.value,
    (newValue) => {
        graphSettings.value.nodelabel = newValue;
    }
);
watch(
    () => workspaceSettings.value?.linklabel.value,
    (newValue) => {
        graphSettings.value.linklabel = newValue;
    }
);
watch(
    () => workspaceSettings.value?.linkcolor.value,
    (newValue) => {
        if(newValue !== '') {
            const possibleValues = Array.from(new Set(data.value.links.map((l) => l[newValue])));
            const colorMap = {};
            for(let i=1; i<=possibleValues.size; i++) {
                colorMap[possibleValues[i-1]] = selectColor(i);
            }
            data.value.links.forEach((l) => {
                l[`new${newValue}`] = colorMap[l[newValue]];
            });
            graphSettings.value.linkcolor = `new${newValue}`;
        }
    }
);
watch(
    () => workspaceSettings.value?.linkwidth.value,
    () => {
        updateLinkWidth();
    }
);
watch(
    () => workspaceSettings.value?.linkwidthmax.value,
    () => {
        updateLinkWidth();
    }
);
function updateLinkWidth() {
    const linkVal = workspaceSettings.value?.linkwidth.value;
    const linkMax = workspaceSettings.value?.linkwidthmax.value;
    const linkMin = 1;
    const newRange = linkMax-linkMin;

    const oldMax = Math.max(data.value.links[linkVal]);
    const oldMin = Math.min(data.value.links[linkVal]);
    const oldRange = oldMax-oldMin;

    data.value.links.forEach((l) => {
        const percent = (l[linkVal] - oldMin) / oldRange;
        const newVal = (percent * newRange) + linkMin;

        l[`new${linkVal}`] = newVal;
    });
    graphSettings.value.linkwidth = `new${linkVal}`;
}
watch(
    () => workspaceSettings.value?.directionallinks.value,
    (newValue) => {
        graphSettings.value.directionallinks = newValue;
    }
);


function selectColor(number) {
    const hue = number * 137.508; // golden angle approximation
    return `hsl(${hue},50%,75%)`;
}

</script>
