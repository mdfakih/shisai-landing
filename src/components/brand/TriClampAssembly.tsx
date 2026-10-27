import { useId } from 'react';
import { cn } from '@/lib/utils';

export type PartId = 'tube' | 'ferrule' | 'gasket' | 'clamp';

interface TriClampAssemblyProps {
  /** 0 = assembled, 1 = fully exploded. */
  explode?: number;
  /** Dim everything except this part. */
  highlight?: PartId | null;
  /** Show engineering dimension lines. */
  showDims?: boolean;
  /** Soft static ground shadow under the assembly. */
  showShadow?: boolean;
  /** Render a subset so layers can be stacked in 3D. */
  layer?: 'all' | 'body' | 'clamp';
  className?: string;
}

const AXIS = 230;
const SPREAD = 76;
const LIFT = 140;

/**
 * Side elevation of a hygienic tri-clamp joint: two ferrules, a gasket,
 * a clamp band. Pure vector, ~5 KB, shaded with gradients so it reads as
 * polished steel. Parts move with `explode` for the scroll-driven view.
 */
export function TriClampAssembly({
  explode = 0,
  highlight = null,
  showDims = false,
  showShadow = false,
  layer = 'all',
  className,
}: TriClampAssemblyProps) {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;
  const url = (k: string) => `url(#${id(k)})`;
  const e = Math.min(1, Math.max(0, explode));
  const dim = (part: PartId) =>
    highlight && highlight !== part ? 0.28 : 1;
  const showBody = layer !== 'clamp';
  const showClamp = layer !== 'body';

  return (
    <svg
      viewBox="0 0 720 440"
      className={cn('h-auto w-full overflow-visible', className)}
      role="img"
      aria-label="Tri-clamp hygienic joint: ferrule, gasket, ferrule, clamp"
    >
      <defs>
        <linearGradient id={id('tube')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6f8" />
          <stop offset="0.14" stopColor="#d3d8df" />
          <stop offset="0.27" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#b3bbc5" />
          <stop offset="0.78" stopColor="#6f7884" />
          <stop offset="0.92" stopColor="#9ba3ae" />
          <stop offset="1" stopColor="#5a626e" />
        </linearGradient>
        <linearGradient id={id('flange')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.18" stopColor="#dde2e8" />
          <stop offset="0.3" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#bcc3cd" />
          <stop offset="0.8" stopColor="#7a838f" />
          <stop offset="1" stopColor="#626b77" />
        </linearGradient>
        <linearGradient id={id('clamp')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef1f4" />
          <stop offset="0.12" stopColor="#c9cfd7" />
          <stop offset="0.24" stopColor="#fbfcfd" />
          <stop offset="0.5" stopColor="#a9b1bc" />
          <stop offset="0.74" stopColor="#5f6874" />
          <stop offset="0.9" stopColor="#8d96a1" />
          <stop offset="1" stopColor="#4f5762" />
        </linearGradient>
        <linearGradient id={id('gasket')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#eef1f4" />
          <stop offset="1" stopColor="#c9d0d8" />
        </linearGradient>
        <radialGradient id={id('bore')} cx="0.45" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#1d2129" />
          <stop offset="0.7" stopColor="#3a414c" />
          <stop offset="1" stopColor="#7a838f" />
        </radialGradient>
        <linearGradient id={id('fadeL')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={id('maskL')}>
          <rect x="0" y="0" width="720" height="440" fill={url('fadeL')} />
        </mask>
        <radialGradient id={id('ground')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="hsl(var(--primary-deep))" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="hsl(var(--primary-deep))" stopOpacity="0.1" />
          <stop offset="1" stopColor="hsl(var(--primary-deep))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {showShadow && layer !== 'clamp' && (
        <ellipse cx="330" cy={AXIS + 112} rx="270" ry="22" fill={url('ground')} />
      )}

      {showBody && (
        <>
          {/* LEFT tube + ferrule */}
          <g
            style={{ transform: `translateX(${-e * SPREAD}px)` }}
          >
            <g opacity={dim('tube')} mask={url('maskL')}>
              <rect x="0" y={AXIS - 44} width="252" height="88" fill={url('tube')} />
              <rect x="0" y={AXIS - 44} width="252" height="2" fill="#fff" opacity="0.6" />
            </g>
            <g opacity={dim('ferrule')}>
              <rect x="250" y={AXIS - 60} width="24" height="120" rx="2.5" fill={url('flange')} stroke="#5a626e" strokeOpacity="0.35" />
              <rect x="252" y={AXIS - 58} width="2" height="116" fill="#fff" opacity="0.45" />
              <rect x="270" y={AXIS - 58} width="2" height="116" fill="#2b313a" opacity="0.25" />
            </g>
          </g>

          {/* GASKET */}
          <g opacity={dim('gasket')}>
            <rect x="274" y={AXIS - 57} width="10" height="114" rx="2" fill={url('gasket')} stroke="#aab2bd" strokeWidth="0.8" />
            <rect x="277" y={AXIS - 52} width="1.5" height="104" fill="#fff" opacity="0.9" />
          </g>

          {/* RIGHT ferrule + tube */}
          <g
            style={{ transform: `translateX(${e * SPREAD}px)` }}
          >
            <g opacity={dim('ferrule')}>
              <rect x="284" y={AXIS - 60} width="24" height="120" rx="2.5" fill={url('flange')} stroke="#5a626e" strokeOpacity="0.35" />
              <rect x="286" y={AXIS - 58} width="2" height="116" fill="#fff" opacity="0.45" />
            </g>
            <g opacity={dim('tube')}>
              <rect x="308" y={AXIS - 44} width="262" height="88" fill={url('tube')} />
              <rect x="308" y={AXIS - 44} width="262" height="2" fill="#fff" opacity="0.6" />
              {/* end face */}
              <ellipse cx="570" cy={AXIS} rx="17" ry="44" fill={url('flange')} stroke="#5a626e" strokeOpacity="0.4" />
              <ellipse cx="570" cy={AXIS} rx="13.5" ry="39.5" fill={url('bore')} />
              <ellipse cx="570" cy={AXIS} rx="13.5" ry="39.5" fill="none" stroke="#f3f5f7" strokeWidth="1.2" strokeOpacity="0.7" />
            </g>
          </g>
        </>
      )}

      {showClamp && (
        <g
          style={{ transform: `translateY(${-e * LIFT}px)` }}
          opacity={dim('clamp')}
        >
          {/* band */}
          <rect x="241" y={AXIS - 80} width="76" height="160" rx="9" fill={url('clamp')} stroke="#4a525d" strokeOpacity="0.4" />
          <rect x="245" y={AXIS - 76} width="2" height="152" fill="#fff" opacity="0.5" />
          <rect x="311" y={AXIS - 76} width="2" height="152" fill="#1f242c" opacity="0.3" />
          {/* band seam (two halves) */}
          <rect x="241" y={AXIS - 1} width="76" height="1.5" fill="#2b313a" opacity="0.35" />
          {/* top lugs */}
          <rect x="257" y={AXIS - 116} width="44" height="40" rx="4" fill={url('flange')} stroke="#4a525d" strokeOpacity="0.4" />
          <rect x="261" y={AXIS - 112} width="2" height="32" fill="#fff" opacity="0.5" />
          {/* bolt */}
          <rect x="250" y={AXIS - 104} width="58" height="7" rx="3.5" fill={url('tube')} stroke="#4a525d" strokeOpacity="0.5" />
          {/* wing nut */}
          <path
            d={`M 300 ${AXIS - 110} l 26 -14 q 6 -3 7 3 l 2 22 q 1 6 -5 5 l -30 -8 z`}
            fill={url('flange')}
            stroke="#4a525d"
            strokeOpacity="0.5"
          />
          <circle cx="300" cy={AXIS - 100.5} r="6.5" fill={url('clamp')} stroke="#4a525d" strokeOpacity="0.5" />
          {/* bottom hinge */}
          <rect x="266" y={AXIS + 78} width="26" height="18" rx="3" fill={url('flange')} stroke="#4a525d" strokeOpacity="0.4" />
          <circle cx="279" cy={AXIS + 87} r="3" fill="#3a414c" />
        </g>
      )}

      {showDims && layer !== 'clamp' && (
        <g
          className="font-mono"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          opacity={0.7 * (1 - e)}
          fontSize="11"
          letterSpacing="0.08em"
          style={{ paintOrder: 'stroke fill' }}
        >
          {/* OD dimension, left */}
          <line x1="150" y1={AXIS - 44} x2="150" y2={AXIS + 44} />
          <line x1="140" y1={AXIS - 44} x2="160" y2={AXIS - 44} />
          <line x1="140" y1={AXIS + 44} x2="160" y2={AXIS + 44} />
          <text x="158" y={AXIS + 4} stroke="hsl(var(--background))" strokeWidth="3" strokeLinejoin="round" textAnchor="start">
            Ø 50.8
          </text>
          {/* clamp width dimension, bottom */}
          <line x1="241" y1={AXIS + 128} x2="317" y2={AXIS + 128} />
          <line x1="241" y1={AXIS + 120} x2="241" y2={AXIS + 136} />
          <line x1="317" y1={AXIS + 120} x2="317" y2={AXIS + 136} />
          <text x="279" y={AXIS + 150} stroke="hsl(var(--background))" strokeWidth="3" strokeLinejoin="round" textAnchor="middle">
            DIN 32676
          </text>
          {/* leader to bore */}
          <line x1="590" y1={AXIS - 10} x2="640" y2={AXIS - 60} />
          <circle cx="590" cy={AXIS - 10} r="1.8" stroke="none" />
          <text x="644" y={AXIS - 64} stroke="hsl(var(--background))" strokeWidth="3" strokeLinejoin="round" textAnchor="start">
            Ra ≤ 0.8 µm
          </text>
        </g>
      )}
    </svg>
  );
}
