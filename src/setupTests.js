// Configuração global dos testes (carregada antes de cada arquivo de teste)
import '@testing-library/jest-dom/vitest'

// jsdom não implementa scrollIntoView, usado pelo scroll automático do ChatWindow
Element.prototype.scrollIntoView = () => {}
