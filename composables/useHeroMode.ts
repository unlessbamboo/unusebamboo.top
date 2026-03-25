export function useHeroMode() {
  const heroMode = useState<'intro' | 'carousel'>('heroMode', () => 'intro')

  function initFromStorage() {
    heroMode.value = (localStorage.getItem('hero-mode') as 'intro' | 'carousel') ?? 'intro'
  }

  function toggle() {
    heroMode.value = heroMode.value === 'intro' ? 'carousel' : 'intro'
    localStorage.setItem('hero-mode', heroMode.value)
  }

  return { heroMode, toggle, initFromStorage }
}
