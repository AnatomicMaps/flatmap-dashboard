import { defineStore } from 'pinia'

interface State {
    currentPage: string
    usePug: boolean
    tabsView: boolean
    darkMode: boolean
}

export const useMainStore = defineStore('dashboard', {
  state: (): State => {
    return {
      currentPage: '', // The title of the page, to pass to Codepen from examples.
      usePug: false,
      tabsView: true,
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
    },
    initUsePug (state: State) {
      state.usePug = !!parseInt(localStorage.getItem('usePug'))
    },
    setUsePug (state: State, usePug: boolean) {
      if (state.usePug !== usePug) {
        state.usePug = usePug
        localStorage.setItem('usePug', +usePug)
      }
    },
    initTabsView (state: State) {
      state.tabsView = !!parseInt(localStorage.getItem('tabsView'))
    },
    setTabsView (state: State, tabsView: boolean) {
      if (state.tabsView !== tabsView) {
        state.tabsView = tabsView
        localStorage.setItem('tabsView', +tabsView)
      }
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
