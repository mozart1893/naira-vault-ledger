
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
}

export const MermaidDiagram = ({ chart, title }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#8B5CF6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#7E69AB',
        secondaryColor: '#E5DEFF',
        tertiaryColor: '#f8f9fa',
        lineColor: '#6E59A5',
      }
    });
    
    if (containerRef.current) {
      // Clear existing SVG
      containerRef.current.innerHTML = `<div class="mermaid">${chart}</div>`;
      mermaid.init(undefined, containerRef.current.querySelector('.mermaid'));
    }
  }, [chart]);

  return (
    <div className="my-4 bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-lg font-semibold mb-4 text-vault-primary">{title}</h3>}
      <div ref={containerRef} className="overflow-auto"></div>
    </div>
  );
};
