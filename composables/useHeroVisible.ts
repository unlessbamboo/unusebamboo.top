// useState 跨路由导航保持状态（SPA 内跳转不重置），刷新页面重置为 true
export const useHeroVisible = () => useState('hero-visible', () => true)
