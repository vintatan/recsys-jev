import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexProps {
  math: string;
  display?: boolean;
  className?: string;
}

/**
 * Render a single LaTeX formula either inline or display block mode
 */
export const Latex: React.FC<LatexProps> = ({ math, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        trust: true,
      });
    } catch (err) {
      console.error('KaTeX rendering error for math:', math, err);
      return `<span class="text-rose-400 font-mono text-xs">${math}</span>`;
    }
  }, [math, display]);

  if (display) {
    return (
      <div
        className={`my-2 overflow-x-auto text-center font-serif text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block font-serif text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface LatexTextProps {
  children: string;
  className?: string;
}

/**
 * Parses mixed text containing $inline$ and $$block$$ LaTeX notation
 * and renders formatted math segments with KaTeX.
 */
export const LatexText: React.FC<LatexTextProps> = ({ children, className = '' }) => {
  const segments = useMemo(() => {
    if (!children) return [];

    // Split on $$...$$ and $...$
    // Pattern matches $$block$$ or $inline$
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
    const parts = children.split(regex);

    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <div
              key={idx}
              className="my-2 overflow-x-auto text-center font-serif text-slate-100 py-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="font-mono text-rose-400">{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return (
            <span
              key={idx}
              className="inline-block px-0.5 font-serif text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="font-mono text-rose-400">{part}</span>;
        }
      }

      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  }, [children]);

  return <span className={className}>{segments}</span>;
};
