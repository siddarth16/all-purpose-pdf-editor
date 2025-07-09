import React from 'react'
import { Heart, Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-white/80 text-sm">
            Made with <Heart className="w-4 h-4 inline text-red-400" /> by the open source community
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-white/60 text-xs mt-4">
            Free PDF tools. No registration required. Your files never leave your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 