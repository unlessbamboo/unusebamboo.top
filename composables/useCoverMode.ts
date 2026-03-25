export function useCoverMode() {
  const coverMode = useState<'hero' | 'blur'>('coverMode', () => 'hero')

  function initFromStorage() {
    coverMode.value = (localStorage.getItem('cover-mode') as 'hero' | 'blur') ?? 'hero'
  }

  function toggle() {
    coverMode.value = coverMode.value === 'hero' ? 'blur' : 'hero'
    localStorage.setItem('cover-mode', coverMode.value)
  }

  return { coverMode, toggle, initFromStorage }
}
