<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMoviesStore } from '@/stores/movies'

const { t } = useI18n()
import FavoriteDecadesCard from '@/components/favorites/FavoriteDecadesCard.vue'
import FavoriteGenresCard from '@/components/favorites/FavoriteGenresCard.vue'
import FavDirectos from '@/components/favorites/FavDirectos.vue'
import FavActors from '@/components/favorites/FavActors.vue'
import FavWritters from '@/components/favorites/FavWritters.vue'

const moviesStore = useMoviesStore()

const favoriteMovies = computed(() => {
  return moviesStore.movies.filter(movie => movie.favorite === true)
})

const totalFavoriteMovies = computed(() => {
  return favoriteMovies.value.length
})

const totalFavoriteHours = computed(() => {
  const estimatedMinutes = favoriteMovies.value.length * 120
  return (estimatedMinutes / 60).toFixed(1)
})

const favoriteMoviesChartSeries = computed(() => [totalFavoriteMovies.value])

const favoriteMoviesChartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    sparkline: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '65%',
      },
      track: {
        background: 'rgba(148, 163, 184, 0.15)',
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Favoritas'],
  colors: ['#a78bfa'],
}))

const favoriteHoursChartSeries = computed(() => [Number(totalFavoriteHours.value)])

const favoriteHoursChartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    sparkline: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '65%',
      },
      track: {
        background: 'rgba(148, 163, 184, 0.15)',
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Horas'],
  colors: ['#60a5fa'],
}))
</script>


<template>
  <main class="flex-1 max-w-7xl mx-auto w-full">
    <section class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="lg:col-span-2 flex flex-col gap-6">
        <h3 class="text-lg font-bold text-white">
          {{ t('statsFavs.title') }}
        </h3>
        <p class="text-slate-400 text-sm font-medium tracking-wider">
          {{ t('statsFavs.description') }}
        </p>
        <div class="glass rounded-xl border border-white/10 bg-white/5 p-6">
          <div class="flex justify-between items-start">
            <div class="flex items-center md:flex md:items-center">
                <span class="material-symbols-outlined text-blue-400 bg-blue-400/10 p-2 rounded-lg">
                  movie
                </span>
                <h2 class="text-md md:text-2xl font-bold text-white ml-2">
                    {{ t('statsFavs.moviesLabel') }}
                </h2>
            </div>
            <div class="w-20 h-20">
              <apexchart
                type="radialBar"
                height="80"
                :options="favoriteMoviesChartOptions"
                :series="favoriteMoviesChartSeries"
              />
            </div>
          </div>
          <p class="text-4xl font-bold text-white mt-1">
            {{ totalFavoriteMovies }}
          </p>
        </div>

        <div class="glass rounded-xl border border-white/10 bg-white/5 p-6">
          <div class="flex justify-between items-start">
            <div class="flex items-center md:flex md:items-center">
              <span class="material-symbols-outlined text-blue-400 bg-blue-400/10 p-2 rounded-lg">
                task_alt
              </span>
              <h2 class="text-md md:text-2xl font-bold text-white ml-2">
                {{ t('statsFavs.hoursLabel') }}
              </h2>
            </div>
            <div class="w-20 h-20">
              <apexchart
                type="radialBar"
                height="80"
                :options="favoriteHoursChartOptions"
                :series="favoriteHoursChartSeries"
              />
            </div>
          </div>
          <p class="text-4xl font-bold text-white mt-1">
            {{ totalFavoriteHours }} {{ t('statsFavs.hoursSuffix') }}
          </p>
        </div>
      </div>

      <FavoriteDecadesCard />
      <FavoriteGenresCard />
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FavDirectos />
      <FavActors />
      <FavWritters />
    </section>
  </main>
</template>