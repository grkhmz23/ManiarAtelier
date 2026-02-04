import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type CategorySection = {
  id: string;
  background: string;
  leftLabel: string;
  title: string;
  rightLabel: string;
};

type ContainedCategoryFXProps = {
  sections: CategorySection[];
  autoAdvance?: boolean;
  intervalMs?: number;
  onSectionClick?: (index: number) => void;
};

export const ContainedCategoryFX: React.FC<ContainedCategoryFXProps> = ({
  sections,
  autoAdvance = true,
  intervalMs = 4000,
  onSectionClick,
}) => {
  const [index, setIndex] = useState(0);
  const bgRefs = useRef<HTMLDivElement[]>([]);
  const wordRefs = useRef<HTMLSpanElement[][]>([]);
  const leftItemRefs = useRef<HTMLDivElement[]>([]);
  const rightItemRefs = useRef<HTMLDivElement[]>([]);
  const tempWordBucket = useRef<HTMLSpanElement[]>([]);
  const timerRef = useRef<number | null>(null);

  const total = sections.length;

  const splitWords = (text: string) => {
    const words = text.split(/\s+/).filter(Boolean);
    return words.map((w, i) => (
      <span className="category-word-mask" key={i}>
        <span className="category-word" ref={(el) => el && tempWordBucket.current.push(el)}>
          {w}
        </span>
        {i < words.length - 1 ? " " : null}
      </span>
    ));
  };

  const goTo = (to: number) => {
    if (to === index || to < 0 || to >= total) return;
    
    const from = index;
    const down = to > from;
    setIndex(to);

    // Background fade transition
    const prevBg = bgRefs.current[from];
    const newBg = bgRefs.current[to];
    
    if (newBg) {
      gsap.set(newBg, { opacity: 0, scale: 1.04 });
      gsap.to(newBg, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
    }
    if (prevBg) {
      gsap.to(prevBg, { opacity: 0, duration: 0.8, ease: "power2.out" });
    }

    // Center title word animation
    const outWords = wordRefs.current[from] || [];
    const inWords = wordRefs.current[to] || [];
    
    if (outWords.length) {
      gsap.to(outWords, {
        yPercent: down ? -100 : 100,
        opacity: 0,
        duration: 0.5,
        stagger: down ? 0.03 : -0.03,
        ease: "power3.out",
      });
    }
    if (inWords.length) {
      gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 });
      gsap.to(inWords, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        stagger: down ? 0.05 : -0.05,
        ease: "power3.out",
      });
    }

    // Left/right labels animation
    leftItemRefs.current.forEach((el, i) => {
      gsap.to(el, {
        opacity: i === to ? 1 : 0.35,
        x: i === to ? 10 : 0,
        duration: 0.5,
        ease: "power3.out",
      });
    });
    rightItemRefs.current.forEach((el, i) => {
      gsap.to(el, {
        opacity: i === to ? 1 : 0.35,
        x: i === to ? -10 : 0,
        duration: 0.5,
        ease: "power3.out",
      });
    });
  };

  const handleClick = (i: number) => {
    goTo(i);
    onSectionClick?.(i);
    
    // Reset auto-advance timer
    if (autoAdvance && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % total);
      }, intervalMs);
    }
  };

  // Auto-advance
  useEffect(() => {
    if (!autoAdvance) return;
    
    timerRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoAdvance, intervalMs, total]);

  // Initialize backgrounds and words
  useEffect(() => {
    gsap.set(bgRefs.current, { opacity: 0, scale: 1.04 });
    if (bgRefs.current[0]) gsap.set(bgRefs.current[0], { opacity: 1, scale: 1 });

    wordRefs.current.forEach((words, sIdx) => {
      words.forEach((w) => {
        gsap.set(w, {
          yPercent: sIdx === 0 ? 0 : 100,
          opacity: sIdx === 0 ? 1 : 0,
        });
      });
    });

    // Initialize list items
    leftItemRefs.current.forEach((el, i) => {
      gsap.set(el, { opacity: i === 0 ? 1 : 0.35, x: i === 0 ? 10 : 0 });
    });
    rightItemRefs.current.forEach((el, i) => {
      gsap.set(el, { opacity: i === 0 ? 1 : 0.35, x: i === 0 ? -10 : 0 });
    });
  }, []);

  // React to index changes (from auto-advance)
  useEffect(() => {
    if (index > 0) {
      const from = index === 0 ? total - 1 : index - 1;
      const to = index;

      const prevBg = bgRefs.current[from];
      const newBg = bgRefs.current[to];
      
      if (newBg) {
        gsap.set(newBg, { opacity: 0, scale: 1.04 });
        gsap.to(newBg, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
      }
      if (prevBg) {
        gsap.to(prevBg, { opacity: 0, duration: 0.8, ease: "power2.out" });
      }

      const outWords = wordRefs.current[from] || [];
      const inWords = wordRefs.current[to] || [];
      
      if (outWords.length) {
        gsap.to(outWords, {
          yPercent: -100,
          opacity: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.out",
        });
      }
      if (inWords.length) {
        gsap.set(inWords, { yPercent: 100, opacity: 0 });
        gsap.to(inWords, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.out",
        });
      }

      leftItemRefs.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: i === to ? 1 : 0.35,
          x: i === to ? 10 : 0,
          duration: 0.5,
          ease: "power3.out",
        });
      });
      rightItemRefs.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: i === to ? 1 : 0.35,
          x: i === to ? -10 : 0,
          duration: 0.5,
          ease: "power3.out",
        });
      });
    }
  }, [index, total]);

  const WordsCollector = ({ sectionIndex }: { sectionIndex: number }) => {
    useEffect(() => {
      if (tempWordBucket.current.length) {
        wordRefs.current[sectionIndex] = [...tempWordBucket.current];
      }
      tempWordBucket.current = [];
    }, [sectionIndex]);
    return null;
  };

  return (
    <div style={styles.container}>
      {/* Backgrounds */}
      <div style={styles.backgrounds}>
        {sections.map((s, i) => (
          <div
            key={s.id}
            style={{
              ...styles.background,
              backgroundImage: `url(${s.background})`,
            }}
            ref={(el) => el && (bgRefs.current[i] = el)}
          >
            <div style={styles.overlay} />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div style={styles.content}>
        {/* Left labels */}
        <div style={styles.leftColumn}>
          {sections.map((s, i) => (
            <div
              key={`L-${s.id}`}
              style={styles.item}
              ref={(el) => el && (leftItemRefs.current[i] = el)}
              onClick={() => handleClick(i)}
            >
              {s.leftLabel}
            </div>
          ))}
        </div>

        {/* Center titles */}
        <div style={styles.center}>
          {sections.map((s, sIdx) => {
            tempWordBucket.current = [];
            return (
              <div 
                key={`C-${s.id}`} 
                style={{
                  ...styles.featured,
                  opacity: sIdx === index ? 1 : 0,
                  visibility: sIdx === index ? 'visible' : 'hidden',
                }}
              >
                <h3 style={styles.title}>{splitWords(s.title)}</h3>
                <WordsCollector sectionIndex={sIdx} />
              </div>
            );
          })}
        </div>

        {/* Right labels */}
        <div style={styles.rightColumn}>
          {sections.map((s, i) => (
            <div
              key={`R-${s.id}`}
              style={styles.item}
              ref={(el) => el && (rightItemRefs.current[i] = el)}
              onClick={() => handleClick(i)}
            >
              {s.rightLabel}
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div style={styles.progress}>
        <span style={styles.progressText}>{String(index + 1).padStart(2, "0")}</span>
        <span style={styles.progressText}>{String(total).padStart(2, "0")}</span>
      </div>

      <style>{`
        .category-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: middle;
        }
        .category-word {
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    height: '85vh',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '22px',
    background: '#070817',
  },
  backgrounds: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  background: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0,
    willChange: 'transform, opacity',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(7, 8, 23, 0.4)',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr',
    alignItems: 'center',
    padding: '0 2rem',
    gap: '2rem',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'flex-end',
  },
  item: {
    color: '#F4E5A7',
    fontWeight: 800,
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    opacity: 0.35,
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    transition: 'opacity 0.3s ease',
  },
  center: {
    position: 'relative',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featured: {
    position: 'absolute',
  },
  title: {
    margin: 0,
    color: '#F4E5A7',
    fontWeight: 900,
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    letterSpacing: '-0.01em',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  progress: {
    position: 'absolute',
    bottom: '3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
    display: 'flex',
    gap: '1rem',
  },
  progressText: {
    fontSize: '0.9rem',
    color: 'rgba(244, 229, 167, 0.6)',
    fontWeight: 600,
  },
};
