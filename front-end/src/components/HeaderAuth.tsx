import { CircleUser } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

function HeaderAuth() {
  return (
    <header className="bg-primary h-16 w-full flex items-center justify-between text-white text-xl px-4">
      <div>
        <button type="button">
          <img src="/vite.svg" alt="Logo" className="h-10" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <button
          title='Profile'
          type='button'
          className='global-btn'
        >
          <CircleUser />
        </button>
      </div>
    </header>
  )
}

export default HeaderAuth