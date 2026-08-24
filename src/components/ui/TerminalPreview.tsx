interface TerminalPreviewProps {
  command: string;
  output: string;
  className?: string;
  bare?: boolean;
}

export function TerminalPreview({ command, output, className, bare = false }: TerminalPreviewProps) {
  return (
    <div
      className={`overflow-hidden bg-cinema-ink ${bare ? "" : "rounded-2xl border border-white/10"} ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[18.9px] text-white/40">R Console</span>
      </div>
      <div className="px-5 py-5 font-mono text-[20.25px] leading-relaxed">
        <p>
          <span className="text-cinema-gold">{">"} </span>
          <span className="text-white">{command}</span>
        </p>
        <pre className="mt-2 whitespace-pre-wrap text-white/60">{output}</pre>
      </div>
    </div>
  );
}
