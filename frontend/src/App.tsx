import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="sticky top-0 z-10 bg-white border-b">
    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">🍰 Cake Gallery</h1>
      <button className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90">
        + Add Cake
      </button>
    </div>
  </header>

  {/* Grid */}
  <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {/* Card */}
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <img
        src="https://source.unsplash.com/400x300/?cake"
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="font-semibold text-lg">Chocolate Cake</h2>
        <p className="text-sm text-gray-500 line-clamp-2">
          Rich and creamy chocolate cake...
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-yellow-500">★★★★★</span>
          <button className="text-red-500 text-sm hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
    </>
  )
}

export default App
