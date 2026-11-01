export default function DemoOpenPage() {
  return (
    <main style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <iframe
        title="AEGIS prototype"
        src="/deputy-prototype/index.html"
        style={{ border: 0, height: "100%", width: "100%" }}
      />
    </main>
  );
}
