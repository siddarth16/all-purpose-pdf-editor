import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, Menu, X, FileText, ChevronDown } from 'lucide-react'
import { useThemeStore } from '../store/theme'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const toolsRef = useRef(null)

  const tools = [
    { name: 'Merge PDF', path: '/merge-pdf' },
    { name: 'Split PDF', path: '/split-pdf' },
    { name: 'Compress PDF', path: '/compress-pdf' },
    { name: 'Edit PDF', path: '/edit-pdf' },
    { name: 'Protect PDF', path: '/protect-pdf' },
    { name: 'Watermark PDF', path: '/watermark-pdf' },
    { name: 'Page Numbers', path: '/page-numbers' },
    { name: 'Headers & Footers', path: '/headers-footers' },
    { name: 'PDF to JPG', path: '/pdf-to-jpg' },
    { name: 'JPG to PDF', path: '/jpg-to-pdf' },
    { name: 'PDF to PNG', path: '/pdf-to-png' },
    { name: 'PNG to PDF', path: '/png-to-pdf' },
    { name: 'PDF Reader', path: '/pdf-reader' },
    { name: 'OCR PDF', path: '/ocr-pdf' },
    { name: 'HTML to PDF', path: '/html-to-pdf' },
    { name: 'Word to PDF', path: '/word-to-pdf' },
    { name: 'Excel to PDF', path: '/excel-to-pdf' },
    { name: 'PowerPoint to PDF', path: '/powerpoint-to-pdf' },
    { name: 'PDF to Word', path: '/pdf-to-word' },
    { name: 'PDF to Excel', path: '/pdf-to-excel' },
    { name: 'Unlock PDF', path: '/unlock-pdf' },
    { name: 'Organize PDF', path: '/organize-pdf' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              PDF Toolkit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-secondary hover:text-primary transition-colors duration-200">
              Home
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center space-x-1 text-secondary hover:text-primary transition-colors duration-200"
              >
                <span>Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 glass-dark rounded-lg shadow-xl border border-white/20 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-1 px-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="block px-3 py-2 text-secondary hover:text-primary hover:bg-white/10 rounded-md transition-colors duration-200"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg glass hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-dark border-t border-white/10">
              <Link
                to="/"
                className="block px-3 py-2 text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Tools Section */}
              <div className="px-3 py-2">
                <div className="text-primary font-medium mb-2">Tools</div>
                <div className="grid grid-cols-1 gap-1 pl-4">
                  {tools.slice(0, 8).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-secondary hover:text-primary transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 