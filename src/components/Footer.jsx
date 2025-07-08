import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Github, 
  Heart,
  Shield,
  Info,
  Mail,
  Globe
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Popular Tools',
      links: [
        { name: 'Merge PDF', path: '/merge-pdf' },
        { name: 'Split PDF', path: '/split-pdf' },
        { name: 'Compress PDF', path: '/compress-pdf' },
        { name: 'PDF to Word', path: '/pdf-to-word' },
        { name: 'Edit PDF', path: '/edit-pdf' },
      ]
    },
    {
      title: 'Convert',
      links: [
        { name: 'PDF to JPG', path: '/pdf-to-jpg' },
        { name: 'Word to PDF', path: '/word-to-pdf' },
        { name: 'Excel to PDF', path: '/excel-to-pdf' },
        { name: 'PowerPoint to PDF', path: '/powerpoint-to-pdf' },
        { name: 'HTML to PDF', path: '/html-to-pdf' },
      ]
    },
    {
      title: 'Security',
      links: [
        { name: 'Protect PDF', path: '/protect-pdf' },
        { name: 'Unlock PDF', path: '/unlock-pdf' },
        { name: 'Sign PDF', path: '/sign-pdf' },
        { name: 'Watermark PDF', path: '/watermark-pdf' },
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Open Source', path: '/open-source' },
        { name: 'FAQ', path: '/faq' },
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.footer
      className="glass border-t border-white/10 mt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Ultimate PDF
              </span>
            </Link>
            <p className="text-white/70 text-sm mb-6">
              Free, open-source PDF tools. No registration required, no limits, 
              completely private and secure.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername/ultimate-pdf-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
              <a
                href="mailto:support@ultimatepdf.com"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Contact us"
              >
                <Mail className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2 text-white/70 text-sm mb-4 md:mb-0">
            <span>© {currentYear} Ultimate PDF Toolkit</span>
            <span>•</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for privacy</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-white/70">
              <Shield className="w-4 h-4" />
              <span>100% Client-Side</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Globe className="w-4 h-4" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Info className="w-4 h-4" />
              <span>No Tracking</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer 