import { Button } from '@/components/ui/Button'
import React from 'react'

const SocialBtns = () => {
  return (
    <>
    
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 text-black-700 hover:bg-gray-100"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="h-4 w-4"
        />
        Google
      </Button>

      <Button
        type="button"
        className="flex items-center gap-2 bg-gray-800 text-black-700 hover:bg-gray-700"
      >
        <img
          src="https://www.svgrepo.com/show/349375/github.svg"
          alt="GitHub"
          className="h-5 w-5"
        />
        GitHub
      </Button>
    </div>
    </>
  )
}

export default SocialBtns