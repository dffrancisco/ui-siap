import config from '../ts/config'

declare global {
    interface Window { config: typeof config }
}



//isso é um teste que vi em um canal
//a interface do config fica global
//modo de usar
//window.config
//https://www.youtube.com/watch?v=2gNc_3YyYqk&list=PL_2VhOvlMk4XLzvGgqbmjF9PkVgUGMDcJ
