import React from 'react'
import { Heart, Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-secondary text-sm">
            Made with <Heart className="w-4 h-4 inline text-red-400" /> by Siddarth Choudhary (Open Source Community Contributor)
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="https://github.com/siddarth16/all-purpose-pdf-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-muted text-xs mt-4">
            Free PDF tools. No registration required. Your files never leave your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 