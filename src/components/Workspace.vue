<!-- A workspace is the main network component of the application. It pretty much 
just contains a network graph that is formatted according to settings from 
the workspace container. -->

<template>
  <div :id="`${props.settings.workspaceid}-network`">second hello world</div>
  <v-btn @click="testOutput">TestNet</v-btn>
</template>

<script setup>
import { ref } from "vue";
import ForceGraph from "force-graph";
import { onMounted } from "vue";
import { watch } from "vue";

const props = defineProps(["settings", "data"]);

watch(
  () => props.settings.updatetoggle,
  () => {
    console.log("graph settings updated");
    updateGraph();
  },
);

function testOutput() {
  console.log(props);
  updateGraph();
}

const tempdata = ref({
  nodes: [
    {
      id: "id1",
      name: "name1",
      val: 1,
    },
    {
      id: "id2",
      name: "name2",
      val: 2,
    },
    {
      id: "id3",
      name: "name3",
      val: 3,
    },
  ],
  links: [
    {
      source: "id1",
      target: "id2",
    },
    {
      source: "id1",
      target: "id3",
    },
    {
      source: "id3",
      target: "id2",
    },
  ],
});

const graph = ref(null);

function updateGraph() {
  graph.value
    .nodeVal(props.settings.nodesize)
    .nodeColor(props.settings.nodecolor)
    .nodeLabel(props.settings.nodelabel)
    .linkLabel(props.settings.linklabel)
    .linkColor(props.settings.linkcolor)
    .linkWidth(props.settings.linkwidth)
    .linkDirectionalArrowLength(props.settings.directionallinks ? 4 : 0)
    .graphData(props.data)
    .d3ReheatSimulation();

  console.log("finished updating graph supposedly");
}

function setupGraph() {
  const graphElement = document.getElementById(
    `${props.settings.workspaceid}-network`,
  );

  graph.value = ForceGraph()(graphElement)
    .nodeVal(props.settings?.nodesize || "val")
    .nodeColor(props.settings?.nodecolor || "color")
    .nodeLabel(props.settings?.nodelabel || "name")
    .linkLabel(props.settings?.linklabel || "name")
    .linkColor(props.settings?.linkcolor || "color")
    .linkWidth(props.settings?.linkwidth || 1)
    .linkDirectionalArrowLength(props.settings?.directionallinks ? 4 : 0)
    .graphData(props.data ? props.data : tempdata.value);
}

// watch(props.data, () => {
//     graph.value.graphData(props.data);
// });

onMounted(() => {
  setupGraph();
});
</script>
