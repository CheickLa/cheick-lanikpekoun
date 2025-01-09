import Link from 'next/link'

// Page accueil
export default function Pokemon () {
    return <div className="h-screen flex justify-center items-center bg-zinc-150">
      <Link href="/pokedex" className='bg-blue-700 p-4 rounded-lg text-white'>Clique pour aller voir Pokemons 👀 </Link>
    </div>
}