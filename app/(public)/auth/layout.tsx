export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const NAV_HEIGHT = 30;
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          paddingTop: `${NAV_HEIGHT + 20}px`, // avoid content under nav
          background: "#f7f9f9",
          boxSizing: "border-box",
          overflowY: "auto", // scrollable on small screens
        }}
      >
        {children}
      </main>
    </>
  );
}
