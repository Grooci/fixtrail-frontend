export default function Stars({ value, size = 16 }: { value: number; size?: number }) {
    const rounded = Math.round(value);
    return (
      <span aria-label={`${value.toFixed(1)} out of 5`} style={{ fontSize: size, letterSpacing: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} style={{ color: n <= rounded ? "#f5a623" : "#ccc" }}>★</span>
        ))}
      </span>
    );
  }