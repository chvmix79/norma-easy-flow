import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "¿Qué es el SG-SST y cuándo es obligatorio?",
  "¿Cómo registro mis bases de datos ante la SIC?",
  "¿Qué es el SAGRILAFT y aplica a mi empresa?",
  "¿Cuáles son las multas por no cumplir Habeas Data?",
  "¿Qué tareas debo hacer primero?",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: "Como asistente de cumplimiento normativo colombiano, puedo ayudarte a entender las obligaciones legales de tu empresa. El sistema ha analizado tu perfil empresarial y generado un plan personalizado. Te recomiendo comenzar con las tareas marcadas como **Críticas** ya que tienen mayor riesgo legal.",
  sgsst: "El **SG-SST (Sistema de Gestión de Seguridad y Salud en el Trabajo)** es obligatorio para **todas las empresas en Colombia** con al menos un empleado, según el Decreto 1072 de 2015 y la Resolución 0312 de 2019.\n\n**Lo que debes hacer:**\n1. Designar un responsable del SG-SST\n2. Realizar la evaluación inicial\n3. Elaborar la política de SST\n4. Conformar el COPASST\n\nLas multas por incumplimiento pueden llegar hasta **500 SMMLV** (~$700 millones COP).",
  habeasdata: "Para registrar tus bases de datos ante la **SIC (Superintendencia de Industria y Comercio)**:\n\n1. Ingresa al portal **RNBD** en www.sic.gov.co\n2. Crea una cuenta como responsable del tratamiento\n3. Registra cada base de datos con: finalidad, tipo de datos, titulares y medidas de seguridad\n4. El registro es **gratuito** y debe actualizarse anualmente\n\n⚠️ El incumplimiento puede generar multas hasta **2.000 SMMLV**.",
};

const getResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes("sgsst") || lower.includes("sg-sst") || lower.includes("seguridad") || lower.includes("salud")) return MOCK_RESPONSES.sgsst;
  if (lower.includes("sic") || lower.includes("bases de datos") || lower.includes("habeas") || lower.includes("datos")) return MOCK_RESPONSES.habeasdata;
  return MOCK_RESPONSES.default;
};

const AIAssistant = () => {
  const { company, kpis } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `¡Hola! Soy tu asistente de cumplimiento normativo para **${company?.nombre ?? "tu empresa"}**. Puedo explicarte las normas en lenguaje sencillo, recomendarte qué hacer primero y detectar riesgos. ¿En qué te puedo ayudar hoy?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const assistantMsg: ChatMessage = { id: `a-${Date.now()}`, role: "assistant", content: getResponse(text), timestamp: new Date().toISOString() };
    setMessages((m) => [...m, assistantMsg]);
    setLoading(false);
  };

  const renderContent = (text: string) =>
    text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} className={line.startsWith("⚠️") ? "text-warning-foreground font-medium" : ""} dangerouslySetInnerHTML={{ __html: bold }} />;
    });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto animate-fade-in">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" /> Asistente de Cumplimiento IA
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Consultas sobre normativas colombianas en lenguaje sencillo.</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-4 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
              {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm space-y-1 ${msg.role === "assistant" ? "bg-card border border-border text-foreground rounded-tl-sm" : "text-white rounded-tr-sm"}`}
              style={msg.role === "user" ? { background: "var(--gradient-primary)" } : undefined}>
              {renderContent(msg.content)}
              <p className={`text-xs mt-1 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                {new Date(msg.timestamp).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button key={s} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3" />{s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Pregunta sobre normativas colombianas..."
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-all hover:opacity-90"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
