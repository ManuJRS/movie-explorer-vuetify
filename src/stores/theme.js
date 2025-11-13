import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const darkMode = ref(false);

    function toggleDarkMode() {
        darkMode.value = !darkMode.value;
    }
    return { darkMode, toggleDarkMode };
});