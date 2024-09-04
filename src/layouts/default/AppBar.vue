<template>
  <v-app-bar dense>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>Workspaces</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-plus" @click="createWorkspaceDialog = true"></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item
        v-for="workspace in store.workspaceNames"
        :key="workspace.workspaceid"
        :title="workspace.workspacename"
        @click="changeWorkspace(workspace.workspaceid)"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="createWorkspaceDialog" width="500">
    <v-card title="Create New Workspace">
      <v-card-text>
        <v-text-field
          v-model="newWorkspaceName"
          :label="'Workspace Name'"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Cancel" @click="cancelCreateNewWorkspace"></v-btn>
        <v-btn text="Submit" @click="createNewWorkspace"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useWorkspacesStore } from "@/store/workspaces";

const store = useWorkspacesStore();

const drawer = ref(false);
const createWorkspaceDialog = ref(false);
const newWorkspaceName = ref("");

function cancelCreateNewWorkspace() {
  newWorkspaceName.value = "";
  createWorkspaceDialog.value = false;
}

function createNewWorkspace() {
  const newWorkspaceId = store.createNewWorkspace(newWorkspaceName.value);
  cancelCreateNewWorkspace();
  store.setSelectedWorkspace(newWorkspaceId);
}

function changeWorkspace(id) {
  store.setSelectedWorkspace(id);
  drawer.value = false;
}

const items = [
  {
    title: "Workspace1",
    value: "workspace1",
  },
  {
    title: "Workspace2",
    value: "workspace2",
  },
];
</script>
