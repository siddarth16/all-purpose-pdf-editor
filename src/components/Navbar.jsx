import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  FileText, 
  Home,
  Github,
  ChevronDown
} from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
  ]

  // Simple tools list for testing
  const pdfTools = [
    { name: 'Merge PDF', path: '/merge-pdf' },
    { name: 'Split PDF', path: '/split-pdf' },
    { name: 'Compress PDF', path: '/compress-pdf' },
    { name: 'Edit PDF', path: '/edit-pdf' },
    { name: 'PDF to Word', path: '/pdf-to-word' },
    { name: 'Word to PDF', path: '/word-to-pdf' },
    { name: 'PDF to Excel', path: '/pdf-to-excel' },
    { name: 'Excel to PDF', path: '/excel-to-pdf' },
    { name: 'PDF to PowerPoint', path: '/pdf-to-powerpoint' },
    { name: 'PowerPoint to PDF', path: '/powerpoint-to-pdf' },
    { name: 'PDF to JPG', path: '/pdf-to-jpg' },
    { name: 'JPG to PDF', path: '/jpg-to-pdf' },
    { name: 'PDF to PNG', path: '/pdf-to-png' },
    { name: 'PNG to PDF', path: '/png-to-pdf' },
    { name: 'Organize PDF', path: '/organize-pdf' },
    { name: 'Protect PDF', path: '/protect-pdf' },
    { name: 'Unlock PDF', path: '/unlock-pdf' },
    { name: 'Sign PDF', path: '/sign-pdf' },
    { name: 'Watermark PDF', path: '/watermark-pdf' },
    { name: 'Page Numbers', path: '/page-numbers' },
    { name: 'OCR PDF', path: '/ocr-pdf' },
    { name: 'HTML to PDF', path: '/html-to-pdf' },
    { name: 'PDF Reader', path: '/pdf-reader' },
    { name: 'Repair PDF', path: '/repair-pdf' },
  ]

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Ultimate PDF
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500/20 text-primary-300' 
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Simple All Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>All Tools</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass rounded-lg shadow-xl border border-white/10 z-50 max-h-96 overflow-y-auto">
                    <div className="py-2">
                      {pdfTools.map((tool) => (
                        <Link
                          key={tool.name}
                          to={tool.path}
                          className="block px-4 py-2 hover:bg-white/10 text-white/80 hover:text-white transition-colors duration-200 text-sm"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
              </button>

              {/* GitHub Link */}
              <a
                href="https://github.com/yourusername/ultimate-pdf-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
              </button>
              
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-4 space-y-2 glass border-t border-white/10">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500/20 text-primary-300' 
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Tools List */}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="text-white/60 text-sm font-medium px-3 py-2">All Tools</div>
                {pdfTools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
              
              <a
                href="https://github.com/yourusername/ultimate-pdf-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
      
      {/* Dropdown backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar 