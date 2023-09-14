

<template>
    <v-table fixed-header>
        <thead>
            <tr>
                <th class="text-left">Setting</th>
                <th class="text-left" style="width:30%">Value</th>
                <th class="text-left">Default</th>
                <th class="text-left">Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Workspace Data File</td>
                <td>
                    <v-file-input label="Workspace File" accept=".json" v-model="datafile"
                        hide-details="auto"
                        class="my-2"
                        variant="solo-filled">
                    </v-file-input>
                </td>
                <td></td>
                <td>JSON data file with network data.</td>
            </tr>
            <tr
                v-for="setting in settings"
                :key="setting.name"
            >
                <td>{{ setting.name }}</td>
                <td>
                    <v-select 
                        v-if="setting.property === 'node'"
                        v-model="setting.value"
                        :label="setting.name"
                        clearable
                        :items="nodeprops"
                        hide-details="auto"
                        class="my-2"
                        variant="solo-filled"
                    ></v-select>
                    <v-select 
                        v-else-if="setting.property === 'link'"
                        v-model="setting.value"
                        :label="setting.name"
                        clearable
                        :items="linkprops"
                        hide-details="auto"
                        class="my-2"
                        variant="solo-filled"
                    ></v-select>
                    <v-text-field 
                        v-else-if="setting.inputType==='v-text-field'"
                        v-model="setting.value"
                        :type="setting.textFieldType || 'text'"
                        :label="setting.name"
                        hide-details="auto"
                        class="my-2"
                        variant="solo-filled"
                        ></v-text-field>
                    <v-textarea
                        v-else-if="setting.inputType==='v-textarea'"
                        v-model="setting.value"
                        :label="setting.name"
                        auto-grow
                        hide-details="auto"
                        class="my-2"
                        variant="solo-filled"
                    ></v-textarea>
                    <v-switch
                        v-else-if="setting.inputType==='v-switch'"
                        v-model="setting.value"
                        :label="setting.value ? `${setting.name}` : `No ${setting.name}`"
                        color="primary"
                        hide-details="auto"
                        class="my-2"
                        variant="solo-filled"
                    ></v-switch>
                </td>
                <td>{{ setting.default || '' }}</td>
                <td>{{ setting.description }}</td>
            </tr>
        </tbody>
    </v-table>
    <v-btn @click="testOutput">TestSettings</v-btn>
    <v-btn 
        class="floating-button" 
        size="x-large" 
        elevated 
        color="red"
        @click="saveSettings"
    >SAVE</v-btn>
</template>

<script setup>
import { watch } from 'vue';
import { ref } from 'vue';

const emit = defineEmits(['saved'])

function saveSettings() {
    for(const s in settings.value) {
        const setting = settings.value[s];
        if ('oldvalue' in setting) {
            if(setting['value'] === setting['oldvalue']) {
                setting['changed'] = false;
            }
            else {
                setting['changed'] = true;
                setting['oldvalue'] = setting['value'];
            }
        }
        else {
            if(setting['value'] === setting['default']) {
                setting['changed'] = false;
            }
            else {
                setting['changed'] = true;
                setting['oldvalue'] = setting['value'];
            }
        }
    }
    
    const dataChanged = (data.value !== oldData.value);
    if(dataChanged) {
        oldData.value = data.value;
    }
    emit('saved', settings.value, data.value, dataChanged);
}

const nodeprops = ref(['id','name'])
const linkprops = ref(['source','target'])

const datafile = ref(null);
const data = ref(null);
const oldData = ref(null);

function testOutput() {
    console.log(data.value);
    console.log(settings.value);
}

watch(
    () => datafile.value,
    async (newValue) => {
        data.value = JSON.parse(await newValue[0].text());
    }
)

watch(data, () => {
    nodeprops.value = Object.keys(data.value.nodes[0]) || [];
    linkprops.value = Object.keys(data.value.links[0]) || [];
});


const settings = ref({
    notes: {
        'name': 'Notes',
        'value': null,
        'default': null,
        'description': 'General workspace notes.',
        'property': null,
        'inputType': 'v-textarea',
    },
    nodecolor: {
        'name': 'Node Color',
        'value': 'color',
        'default': 'color',
        'description': 'The color of the nodes can be set to one of the node properties. If not set, the nodes will be blue.',
        'property': 'node',
        'inputType': 'v-text-field',
    },
    nodesize: {
        'name': 'Node Size',
        'value': 'val',
        'default': 'val',
        'description': 'Node size set from a node property. The default is the "val" property. If set, size values will be scaled between "Node Size Max" and "Node Size Min".',
        'property': 'node',
        'inputType': 'v-text-field',
    },
    nodesizemax: {
        'name': 'Node Size Max',
        'value': 1,
        'default': 1,
        'description': 'The maximum node size if scaling nodes using a node property.',
        'property': null,
        'inputType': 'v-text-field',
        'textFieldType': 'number',
    },
    nodesizemin: {
        'name': 'Node Size Min',
        'value': 1,
        'default': 1,
        'description': 'The minimum node size if scaling nodes using a node property.',
        'property': null,
        'inputType': 'v-text-field',
        'textFieldType': 'number',
    },
    nodelabel: {
        'name': 'Node Label',
        'value': 'name',
        'default': 'name',
        'description': 'Node label set from a node property.',
        'property': 'node',
        'inputType': 'v-text-field',
    },
    linklabel: {
        'name': 'Link Label',
        'value': 'name',
        'default': 'name',
        'description': 'Link label set from a link property.',
        'property': 'link',
        'inputType': 'v-text-field',
    },
    linkcolor: {
        'name': 'Link Color',
        'value': 'color',
        'default': 'color',
        'description': 'Link color set from a link property. If unset, the links will be grey.',
        'property': 'link',
        'inputType': 'v-text-field',
    },
    linkwidth: {
        'name': 'Link Width',
        'value': null,
        'default': null,
        'description': 'Link width set from a link property. If set, values will be scaled between 1 and "Link Width Max".',
        'property': 'link',
        'inputType': 'v-text-field',
    },
    linkwidthmax: {
        'name': 'Link Width Max',
        'value': 1,
        'default': 1,
        'description': 'The maximum link width if scaling link widths using a link property.',
        'property': null,
        'inputType': 'v-text-field',
        'textFieldType': 'number',
    },
    directionallinks: {
        'name': 'Directional Links',
        'value': false,
        'default': false,
        'description': 'Set to true to include arrows in the network graph indicating link directionality.',
        'property': null,
        'inputType': 'v-switch',
    },
});


</script>

<style>
.floating-button {
    position: fixed;
    bottom: 70px;
    right: 70px;
}
</style>