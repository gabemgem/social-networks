<template>
  <v-app-bar dense>
    <v-app-bar-nav-icon @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>Workspaces</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list :items="items"></v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import {ref, watch} from 'vue'

  const drawer = ref(false)

  const items = [
    {
      title: "Workspace1",
      value: "workspace1"
    },
    {
      title: "Workspace2",
      value: "workspace2"
    }
  ]
</script>
