import { mount } from 'svelte'
import App from './App.svelte'
import './app.css'

import './styles/_mixins.scss'
import './styles/_variables.scss'
import './styles/base.scss'
import './styles/inputs.scss'
import './styles/layout.scss'

import './components/AmountInput/AmountInput.scss'
import './components/CurrencySelect/CurrencySelect.scss'
import './components/DarkModeToggle/DarkModeToggle.scss'
import './components/Footer/Footer.scss'
import './components/HistoryList/HistoryList.scss'
import './components/LanguageDropdown/LanguageDropdown.scss'
import './components/LocaleSelect/LocaleSelect.scss'
import './components/ResultDisplay/ResultDisplay.scss'
import './components/SwapButton/SwapButton.scss'
import './components/TopBar/TopBar.scss'



const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
