<script setup>
const year = new Date().getFullYear();
</script>

<template>
<v-footer
app
class="footer"
elevation="0"
>
    <v-container class="text-center py-4">
        <span class="footer-text">Desarrollado por <strong>ManuDev</strong> - {{ year }}</span>
    </v-container>
</v-footer>
</template>

<style scoped>
.footer {
    background-color: transparent;
}
.footer-text {
    opacity: 0.7;
    font-size: 14px;
}
</style>