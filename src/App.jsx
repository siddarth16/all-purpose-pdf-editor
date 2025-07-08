import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/themeStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import PDFToWord from './pages/PDFToWord'
import WordToPDF from './pages/WordToPDF'
import PDFToExcel from './pages/PDFToExcel'
import ExcelToPDF from './pages/ExcelToPDF'
import PDFToPowerPoint from './pages/PDFToPowerPoint'
import PowerPointToPDF from './pages/PowerPointToPDF'
import PDFToJPG from './pages/PDFToJPG'
import JPGToPDF from './pages/JPGToPDF'
import PDFToPNG from './pages/PDFToPNG'
import PNGToPDF from './pages/PNGToPDF'
import EditPDF from './pages/EditPDF'
import OrganizePDF from './pages/OrganizePDF'
import ProtectPDF from './pages/ProtectPDF'
import UnlockPDF from './pages/UnlockPDF'
import SignPDF from './pages/SignPDF'
import WatermarkPDF from './pages/WatermarkPDF'
import PageNumbers from './pages/PageNumbers'
import RepairPDF from './pages/RepairPDF'
import OCRPDF from './pages/OCRPDF'
import HTMLToPDF from './pages/HTMLToPDF'
import PDFReader from './pages/PDFReader'

function App() {
  const { theme } = useThemeStore()
  
  React.useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merge-pdf" element={<MergePDF />} />
            <Route path="/split-pdf" element={<SplitPDF />} />
            <Route path="/compress-pdf" element={<CompressPDF />} />
            <Route path="/pdf-to-word" element={<PDFToWord />} />
            <Route path="/word-to-pdf" element={<WordToPDF />} />
            <Route path="/pdf-to-excel" element={<PDFToExcel />} />
            <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
            <Route path="/pdf-to-powerpoint" element={<PDFToPowerPoint />} />
            <Route path="/powerpoint-to-pdf" element={<PowerPointToPDF />} />
            <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
            <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
            <Route path="/pdf-to-png" element={<PDFToPNG />} />
            <Route path="/png-to-pdf" element={<PNGToPDF />} />
            <Route path="/edit-pdf" element={<EditPDF />} />
            <Route path="/organize-pdf" element={<OrganizePDF />} />
            <Route path="/protect-pdf" element={<ProtectPDF />} />
            <Route path="/unlock-pdf" element={<UnlockPDF />} />
            <Route path="/sign-pdf" element={<SignPDF />} />
            <Route path="/watermark-pdf" element={<WatermarkPDF />} />
            <Route path="/page-numbers" element={<PageNumbers />} />
            <Route path="/repair-pdf" element={<RepairPDF />} />
            <Route path="/ocr-pdf" element={<OCRPDF />} />
            <Route path="/html-to-pdf" element={<HTMLToPDF />} />
            <Route path="/pdf-reader" element={<PDFReader />} />
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