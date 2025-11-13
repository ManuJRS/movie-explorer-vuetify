
<script setup>
import { watch } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

const vuetifyTheme = useTheme();

watch(isDark, (value) => {
    vuetifyTheme.global.name.value = value ? 'dark' : 'light';
}, { immediate: true });

</script>

<template>
<v-app-bar>
    <v-app-bar-title>
        Explorador de peliculas
    </v-app-bar-title>
    <v-spacer>

    </v-spacer>
    <v-switch
        v-model="isDark"
        hide-details
        inset
        :label="isDark ? 'Dark' : 'Light'"
    >

    </v-switch>
</v-app-bar>
</template>
