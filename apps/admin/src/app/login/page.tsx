import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Axioma Starter</h1>
          <p className="text-zinc-400 mt-2 text-sm">Inicia sesión para administrar el sitio</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={login}
            className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
