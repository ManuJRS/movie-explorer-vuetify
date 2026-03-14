<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
<section class="">
  <div class="max-w-7xl mx-auto px-6">

    <div class="grid gap-6 lg:grid-cols-2">

      <!-- FRONTEND -->
      <div class="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6">
        <span class="text-md font-semibold tracking-wide bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
          FRONTEND
        </span>

        <div class="flex flex-wrap gap-1 mt-6">
            <div class="flex items-center gap-2 pr-2">
                <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">Vue 3 + Vite</h3>
            </div>
            <div class="flex items-center gap-2 pr-2">
                <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">Vue Router</h3>
            </div>
            <div class="flex items-center gap-2 pr-2">
                <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">Pinia</h3>
            </div>
            <div class="flex items-center gap-2 pr-2">
                <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">Vue I18n</h3>
            </div>
            <div class="flex items-center gap-2 pr-2">
                <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">Tailwind CSS v4</h3>
            </div>
            <div class="flex items-center gap-2 pr-2">
                <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">ApexCharts</h3>
            </div>
        </div>
      </div>

      <div class="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
        <span class="text-md font-semibold tracking-wide bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
          BACKEND
        </span>

        <div class="flex flex-wrap gap-1 mt-6">
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Supabase Authentication</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Session Management</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Movie Data Storage</h3>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <span class="text-md font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">
          INFRA / DEVOPS
        </span>

        <div class="flex flex-wrap gap-1 mt-6">
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Vite Build System</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">TypeScript</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Commitlint</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
                <h3 class="text-md text-slate-300 font-bold ">Husky Git Hooks</h3>
          </div>    
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Vite Vue DevTools</h3>
          </div>
          </div>
      </div>

      <div class="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
        <span class="text-md font-semibold tracking-wide bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full">
          KEY FEATURES
        </span>

        <div class="flex flex-wrap gap-1 mt-6">
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Movie Tracking</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Recommendations</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Statistics Dashboard</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Favorites</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Watchlist</h3>
          </div>
          <div class="flex items-center gap-2 pr-2">
            <span class="material-symbols-outlined text-green-500">check_small</span>
            <h3 class="text-md text-slate-300 font-bold ">Multi-Language</h3>
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
</template>    