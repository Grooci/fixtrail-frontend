export default function StatusBadge({ status }: { status: string }) {
    const slug = status.toLowerCase().replace(/\s+/g, "-");
    return <span className={`badge s-${slug}`}>{status}</span>;
  }