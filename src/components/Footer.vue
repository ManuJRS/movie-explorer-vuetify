<script setup>
const year = new Date().getFullYear();
</script>

<template>
    <footer class="w-full bg-transparent py-4">
        <div class="text-center">
            <span class="text-sm opacity-70 text-gray-700 dark:text-gray-300">
                Desarrollado por <strong class="font-semibold">ManuDev</strong> - {{ year }}
            </span>
        </div>
    </footer>
</template>
