import { computed, ref } from "vue"
import { useMoviesStore } from "@/stores/movies"
import { required, isValidYear } from "@/validators/movie-form.validators"
import type { FormErrors } from "@/types/errors"
import { buildMoviePayload } from "@/services/movie-form.service"
import type { MoviePosterResult } from "@/lib/tmdb"

export function useAddMovieForm(t: (key: string) => string) {
    const moviesStore = useMoviesStore()

    const validateField = (field: 'title' | 'year' | 'image', value: string | number) => {
        if (field === 'title') {
          const result = required(value, t('form.warning'))
          errors.value!.title = typeof result === 'string' ? result : ''
        } else if (field === 'year') {
          const result = required(value, t('form.warning'))
          if (typeof result === 'string') {
            errors.value!.year = result
          } else {
            const yearResult = isValidYear(value, t('form.warningYear'))
            errors.value!.year = typeof yearResult === 'string' ? yearResult : ''
          }
        } else if (field === 'image') {
          const result = required(value, t('form.warning'))
          errors.value!.image = typeof result === 'string' ? result : ''
        }
      }
      
      const isFormValid = computed(() => {
        const titleValid = !!title.value
        const yearValid = !!year.value && Number(year.value) > 1800 && Number(year.value) < 2100
        const imageValid = !!image.value
        return titleValid && yearValid && imageValid
      })
  
    const title = ref('')
    const year = ref('')
    const image = ref('')
    const platform = ref('')
    const synopsis = ref('')
    const selectedMovieId = ref<number | null>(null)
    const errors = ref<FormErrors>({
      title: '',
      year: '',
      image: '',
      platform: '',
    })
  
    const resetForm = () => {
      title.value = ''
      year.value = ''
      image.value = ''
      platform.value = ''
      synopsis.value = ''
      selectedMovieId.value = null
      errors.value = { title: '', year: '', image: '', platform: '' }
    }

    const handleSelectMovie = (movie: MoviePosterResult) => {
        selectedMovieId.value = movie.id
        title.value = movie.title
        year.value = movie.year
        image.value = movie.posterUrl || ''
      }
  
    const handleSubmit = async () => {
      const titleResult = required(title.value, t('form.warning'))
      const yearResult = required(year.value, t('form.warning'))
      const yearValidResult = isValidYear(year.value, t('form.warningYear'))
      const imageResult = required(image.value, t('form.warning'))

  
      errors.value = {
        title: typeof titleResult === 'string' ? titleResult : '',
        year:
          typeof yearResult === 'string'
            ? yearResult
            : typeof yearValidResult === 'string'
              ? yearValidResult
              : '',
        image: typeof imageResult === 'string' ? imageResult : '',
        platform: '',
      }
  
      if (errors.value.title || errors.value.year || errors.value.image) return false
  
      try {
        const movieData = await buildMoviePayload({
          selectedMovieId: selectedMovieId.value,
          title: title.value,
          year: year.value,
          image: image.value,
          platform: platform.value,
          synopsis: synopsis.value,
        })
  
        moviesStore.addMovie(movieData)
        resetForm()
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    }
  
    return {
      title,
      year,
      image,
      platform,
      synopsis,
      selectedMovieId,
      errors,
      validateField,
      isFormValid,
      handleSubmit,
      resetForm,
      handleSelectMovie,
    }
  }