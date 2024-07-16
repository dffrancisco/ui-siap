import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import themes from './theme'
import globalStage from '@/store/globalState'
import { pt } from 'vuetify/locale'

import { VCalendar } from 'vuetify/labs/VCalendar'


// import { aliases, mdi } from 'vuetify/iconsets/mdi'
// import { aliases, fa } from 'vuetify/iconsets/fa'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import { aliases, md } from 'vuetify/iconsets/md'

const defaultConfig = {
  VBtn: {
    // color: '#9155fd',
  },

  VCard: {
    // elevation: 0,
    // color: '#312d4b'
  },
  VSheet: {
    // color: ''
  },
  VTextField: {
    density: 'compact',
    variant: 'outlined',
    color: 'cyan-lighten-1',
    clearable: true,
    clearIcon: "mdi-close-circle",
    hideDetails: true
  },
  VTextarea: {
    density: 'compact',
    variant: 'outlined',
    color: 'cyan-lighten-1',
    clearable: true,
    clearIcon: "mdi-close-circle",
    hideDetails: true
  },
  VAutocomplete: {
    density: 'compact',
    variant: 'outlined',
    color: 'cyan-lighten-1',
    clearable: true,
    clearIcon: "mdi-close-circle",
    hideDetails: true
  },
  VSelect: {
    density: 'compact',
    variant: 'outlined',
    color: 'cyan-lighten-1',
    clearable: true,
    clearIcon: "mdi-close-circle",
    hideDetails: true
  },
}


const defaultThemeOptions = {
  // defaultTheme: 'dark',
  // defaultTheme: 'light',
  defaultTheme: globalStage.defaultTheme,
  variations: {
    colors: [],
    lighten: 0,
    darken: 0
  },
  themes: themes
}



export default createVuetify({
  icons: {
    defaultSet: 'mdi'
  },
  components: {
    ...components,
    VCalendar,
  },
  directives,
  defaults: defaultConfig,
  theme: defaultThemeOptions,
  locale: {
    locale: 'pt',
    fallback: 'pt',
    messages: { pt },
  },
})
