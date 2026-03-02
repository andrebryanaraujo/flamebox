"use client";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}

export default function LineChart({
  data,
  height = 220,
  color = "#7c3aed",
  formatValue = (v) => String(v),
}: LineChartProps) {
  if (!data.length) return null;

  const padding = { top: 20, right: 20, bottom: 32, left: 55 };
  const width = 600;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`;

  // Y-axis grid lines (4 levels)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const val = minVal + (range * i) / 4;
    const y = padding.top + chartH - ((val - minVal) / range) * chartH;
    return { y, label: formatValue(Math.round(val)) };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={g.y}
            x2={width - padding.right}
            y2={g.y}
            stroke="rgba(124, 58, 237, 0.08)"
            strokeDasharray={i === 0 ? "none" : "4 4"}
          />
          <text
            x={padding.left - 8}
            y={g.y + 4}
            textAnchor="end"
            fill="#6b7280"
            fontSize="10"
            fontFamily="Inter, system-ui, sans-serif"
          >
            {g.label}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#111118" stroke={color} strokeWidth={2} />
          {/* Value label on hover area */}
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            fill="#e5e7eb"
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, system-ui, sans-serif"
            opacity={0.85}
          >
            {formatValue(p.value)}
          </text>
          {/* X-axis label */}
          <text
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="10"
            fontFamily="Inter, system-ui, sans-serif"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
