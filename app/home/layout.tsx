export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-4">
        <nav className="flex justify-between gap-8 items-center container mx-auto">
          <div>Permishout</div>
          <ul>
            <li>Login</li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
