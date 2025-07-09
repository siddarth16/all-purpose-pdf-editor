import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import JPGToPDF from './pages/JPGToPDF'
import ProtectPDF from './pages/ProtectPDF'
import PDFToJPG from './pages/PDFToJPG'
import HTMLToPDF from './pages/HTMLToPDF'
import WatermarkPDF from './pages/WatermarkPDF'
import OCRPDF from './pages/OCRPDF'
import OrganizePDF from './pages/OrganizePDF'
import PDFReader from './pages/PDFReader'
import UnlockPDF from './pages/UnlockPDF'
import PNGToPDF from './pages/PNGToPDF'
import PDFToPNG from './pages/PDFToPNG'
import WordToPDF from './pages/WordToPDF'
import PDFToWord from './pages/PDFToWord'
import ExcelToPDF from './pages/ExcelToPDF'
import PowerPointToPDF from './pages/PowerPointToPDF'
import PDFToExcel from './pages/PDFToExcel'
import EditPDF from './pages/EditPDF'
import PageNumbers from './pages/PageNumbers'

function App() {
  const { initTheme } = useThemeStore()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merge-pdf" element={<MergePDF />} />
            <Route path="/split-pdf" element={<SplitPDF />} />
            <Route path="/compress-pdf" element={<CompressPDF />} />
            <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
            <Route path="/protect-pdf" element={<ProtectPDF />} />
            <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
            <Route path="/html-to-pdf" element={<HTMLToPDF />} />
            <Route path="/watermark-pdf" element={<WatermarkPDF />} />
            <Route path="/ocr-pdf" element={<OCRPDF />} />
            <Route path="/organize-pdf" element={<OrganizePDF />} />
            <Route path="/pdf-reader" element={<PDFReader />} />
            <Route path="/unlock-pdf" element={<UnlockPDF />} />
            <Route path="/png-to-pdf" element={<PNGToPDF />} />
            <Route path="/pdf-to-png" element={<PDFToPNG />} />
            <Route path="/word-to-pdf" element={<WordToPDF />} />
            <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
            <Route path="/powerpoint-to-pdf" element={<PowerPointToPDF />} />
            <Route path="/pdf-to-excel" element={<PDFToExcel />} />
            <Route path="/edit-pdf" element={<EditPDF />} />
            <Route path="/page-numbers" element={<PageNumbers />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App 