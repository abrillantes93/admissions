export const metadata = {
  title: 'Matechecker',
  description: 'Tinder for highschool and colleges',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const router = useRouter();
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/login');
  //   }
  // }, [router]); // Dependency array includes router to re-check on router change

  return (
    <html lang="en">
      <body>

        {children}
      </body>
    </html>
  )
}
