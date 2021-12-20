import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Bookboard</title>
      </Head>
      <Link href="/home">
        <button>
          go to app (temporary)
        </button>
      </Link>
    </div>
  )
}
