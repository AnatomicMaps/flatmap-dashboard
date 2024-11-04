
import { defineStore } from 'pinia'

interface DashboardState {
    currentPage: string
    darkMode: boolean
}

/*
interface MyStore {
    state: {
        count: number
    };
    dispatch: (actionName: string, ...args: unknown[]) => void;
    commit: (mutationName: string, ...args: unknown[]) => void;
}

declare module '@vue/runtime-core' {
    interface ComponentPublicInstance {
        $store: MyStore;
    }
}
*/
export const useMainStore = defineStore('dashboard', {
  state: (): DashboardState => {
    return {
      currentPage: '',
      darkMode: false
    }
  },
/*
  mutations: {
    setDarkMode (state: State, bool: boolean) {
      state.darkMode = bool
      localStorage.darkMode = bool
    },
    setCurrentPage (state: State, pageTitle: string) {
      state.currentPage = pageTitle
    }
  },
*/
  actions: {
    detectDarkMode()
    {
      // Detect the dark mode preference.
      const darkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      this.darkMode = darkMode
      return darkMode
    }
  }
})
