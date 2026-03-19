import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Shield, Eye, EyeOff, Building2, Lock, AlertCircle } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const LoginPage = () => {
  const { login } = useAppStore();
  const [email, setEmail] = useState("demo@compliance360.co");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password);
    if (!ok) setError("Credenciales incorrectas. Usa: demo@compliance360.co / demo1234");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — hero */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <img
          src={heroBanner}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Compliance360</p>
              <p className="text-white/60 text-xs">Colombia</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Gestiona tu cumplimiento normativo de forma <span className="text-accent">automática</span>
            </h1>
            <p className="text-white/70 text-lg">
              SG-SST, Habeas Data, SAGRILAFT, PTEE y más — todo en una sola plataforma diseñada para empresas colombianas.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Normativas", value: "7+" },
              { label: "Tareas auto-generadas", value: "100%" },
              { label: "Tiempo ahorrado", value: "80%" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <Lock className="w-4 h-4 text-accent flex-shrink-0" />
            <p className="text-white/80 text-sm">
              Datos protegidos bajo Ley 1581/2012 · Servidores en Colombia
            </p>
          </div>
        </div>
        <div className="relative z-10 text-white/40 text-xs">
          © 2025 Compliance360 Colombia · Todos los derechos reservados
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-primary">Compliance360</p>
              <p className="text-muted-foreground text-xs">Colombia</p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-foreground mb-1">Bienvenido</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Inicia sesión para gestionar el cumplimiento normativo de tu empresa.
          </p>

          {/* Demo credentials banner */}
          <div className="bg-info/10 border border-info/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
            <p className="text-sm text-info">
              <strong>Demostración:</strong> Usa{" "}
              <code className="bg-info/10 px-1 rounded text-xs">demo@compliance360.co</code> y contraseña{" "}
              <code className="bg-info/10 px-1 rounded text-xs">demo1234</code>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="usuario@empresa.com.co"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="mt-8 grid grid-cols-3 gap-2">
            {[
              { icon: <Shield className="w-4 h-4" />, label: "Datos seguros" },
              { icon: <Building2 className="w-4 h-4" />, label: "Multi-empresa" },
              { icon: <Lock className="w-4 h-4" />, label: "Roles y permisos" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/60 text-muted-foreground text-xs text-center"
              >
                {f.icon}
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
