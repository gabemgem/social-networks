<template>
  <h1>{{ props.settings.workspacename }}</h1>
  {{ props.settings.notes }}
  <pre>{{ JSON.stringify(props.settings, null, 2) }}</pre>

  <pre>{{ JSON.stringify(props.data, null, 2) }}</pre>
</template>

<script setup>
const props = defineProps(["settings", "data"]);
</script>
