"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  Camera,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Brain, Volume2, Zap } from "lucide-react"
import { motion } from "framer-motion"

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [showCameraDialog, setShowCameraDialog] = useState(false)
  const [manualText, setManualText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB"
    }

    const fileType = file.type
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(fileType)) {
      return "File type not supported. Please upload PDF, DOCX, JPG, or PNG files."
    }

    return null
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to translation page
      router.push("/translate")
    } catch (err) {
      setError("Failed to process file. Please try again.")
      setIsProcessing(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploadedFile(file)
    setError(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-document.png", {
            type: "image/png",
          })
          handleFileSelect(file)
          setShowCameraDialog(false)
          // Stop camera stream
          const stream = video.srcObject as MediaStream
          stream?.getTracks().forEach((track) => track.stop())
        }
      })
    }
  }

  const handleManualTextSubmit = () => {
    if (manualText.trim()) {
      setShowTextDialog(false)
      setIsProcessing(true)
      // Simulate processing manual text
      setTimeout(() => {
        router.push("/translate")
      }, 2000)
    }
  }
// 🔹 Reference for upload section
  const uploadSectionRef = useRef<HTMLDivElement>(null)

  // 🔹 Scroll function
  const scrollToUpload = () => {
    if (uploadSectionRef.current) {
      const offsetTop = uploadSectionRef.current.offsetTop
      window.scrollTo({ top: offsetTop, behavior: "smooth" })
    }
  }

  // Add these refs at the top inside your HomePage component:
  const homeSectionRef = useRef<HTMLDivElement>(null)
  const featuresSectionRef = useRef<HTMLDivElement>(null)
  const worksSectionRef = useRef<HTMLDivElement>(null)
  // uploadSectionRef already exists

  // Scroll functions
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black text-white">
      
      {/* 🌟 Header */}
      
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[80%] bg-black/40 backdrop-blur-lg border border-white/10 rounded-full shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          
          {/* Logo + Site Name */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" // 🔥 Replace with your logo path
              alt="HealthSpeak Logo"
              className="h-15 w-15 rounded-md"
            />
            <span className="text-lg md:text-xl font-bold text-white">HealthSpeak</span>
          </div>

          {/* Nav Links */}
          <nav className="flex gap-6 text-sm md:text-base font-medium text-white/80">
            <button className="hover:text-white transition bg-transparent border-0 p-0" onClick={() => scrollToSection(homeSectionRef)}>Home</button>
            <button className="hover:text-white transition bg-transparent border-0 p-0" onClick={() => scrollToSection(featuresSectionRef)}>Features</button>
            <button className="hover:text-white transition bg-transparent border-0 p-0" onClick={() => scrollToSection(worksSectionRef)}>Works</button>
            <button className="hover:text-white transition bg-transparent border-0 p-0" onClick={scrollToUpload}>Upload</button>
          </nav>
        </div>
      </header>


{/* 🌟 Hero Section */}
<section ref={homeSectionRef} id="home" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white px-6 text-center overflow-hidden">
  
  {/* Background subtle effect */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.15),transparent)] pointer-events-none"></div>

  {/* Tagline */}
  <motion.span
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="px-4 py-1 rounded-full bg-white/10 text-sm md:text-base border border-white/20 mb-6 mt-20"
  >
    ⚡ AI-Powered Health Education
  </motion.span>

  {/* Title */}
  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-5xl md:text-7xl font-extrabold leading-tight"
  >
    <span className="text-white">Master Your</span>{" "}
    <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
      Health Knowledge
    </span>
  </motion.h1>

  {/* Subtitle */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.2 }}
    className="text-lg md:text-2xl max-w-2xl text-white/80 mt-6"
  >
    Decode medical jargon instantly with{" "}
    <span className="text-teal-300 font-semibold">clear, simple, and accessible explanations</span>.  
    Empower yourself with AI-driven health insights.
  </motion.p>

  {/* CTA Buttons */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.4 }}
    className="mt-10 flex flex-col md:flex-row gap-4"
  >
    <Button 
      size="lg" 
      className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 py-6 text-lg"
      onClick={scrollToUpload}
    >
      Get Started
    </Button>

    <Button 
      size="lg" 
      variant="outline"
      className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
    >
      Watch Demo
    </Button>
  </motion.div>

  {/* Trust Badges */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.6 }}
    className="mt-12 flex flex-col md:flex-row gap-6 text-sm text-white/70"
  >
    <span>✅ No account required</span>
    <span>🔒 Secure & Private</span>
    <span>👨‍⚕️ Trusted by 5,000+ learners</span>
  </motion.div>
</section>

      {/* Features Section */}
      <section ref={featuresSectionRef} id="features" className="relative z-10 py-24 px-6 bg-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16"> Key Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Upload className="w-10 h-10 text-teal-300" />, title: "Upload Prescription", desc: "Scan or upload your prescription and extract text instantly." },
              { icon: <Brain className="w-10 h-10 text-indigo-300" />, title: "Smart Decode", desc: "Transforms confusing medical jargon into plain, simple language." },
              { icon: <Volume2 className="w-10 h-10 text-cyan-300" />, title: "Voice Narration", desc: "Reads out your instructions for better accessibility." },
              { icon: <Zap className="w-10 h-10 text-yellow-300" />, title: "Lightning Fast", desc: "Get clear results in seconds, no delays or confusion." },
              { icon: "🌐", title: "Browser Based", desc: "Works instantly in your browser — secure and private." },
              { icon: "🤖", title: "Future Ready", desc: "Supports multi-language and AI chat guidance." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card className="bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-300 h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl">{f.icon}</div>
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    <p className="text-white/80">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={worksSectionRef} id="works" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-bold"> How It Works</h2>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { step: "1", title: "Upload", desc: "Upload or scan your prescription." },
              { step: "2", title: "Extract", desc: "OCR instantly captures the text." },
              { step: "3", title: "Decode", desc: "HealthSpeak explains in plain English." },
              { step: "4", title: "Listen", desc: "Optional narration for easy understanding." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Card className="bg-white/10 border border-white/20 hover:scale-105 transform transition-transform duration-300">
                  <CardContent className="p-8 space-y-3">
                    <div className="text-4xl font-bold text-teal-400">{s.step}</div>
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="text-white/80">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload section */}
    <div ref={uploadSectionRef} id="upload" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-slate-900 to-black" >

      {/* Wavy Silk Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path
            fill="url(#grad)"
            fillOpacity="0.4"
            d="M0,96L60,112C120,128,240,160,360,149.3C480,139,600,85,720,96C840,107,960,181,1080,202.7C1200,224,1320,192,1380,176L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5d4" />
              <stop offset="100%" stopColor="#0077b6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Foreground Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full space-y-8 text-center text-white">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
              Translate Your Prescription
            </h1>
            <p className="text-xl opacity-80">
              Get a plain language version of your prescription in seconds.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Processing State */}
          {isProcessing && (
            <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Processing your document...
                  </h3>
                  <p className="text-muted-foreground">
                    Please wait while we analyze your medical document.
                  </p>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </Card>
          )}

          {/* Upload Area - Only show when not processing */}
          {!isProcessing && (
            <>
              <Card
                className={`p-8 border-2 border-dashed transition-colors cursor-pointer bg-white/10 backdrop-blur-lg border-white/20 ${
                  dragActive
                    ? "border-primary bg-primary/20"
                    : uploadedFile
                    ? "border-green-500 bg-green-800/30"
                    : "hover:border-primary"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center space-y-6">
                  {uploadedFile ? (
                    <>
                      <div className="mx-auto w-16 h-16 bg-green-100/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">File Ready</h3>
                        <p className="opacity-80">{uploadedFile.name}</p>
                        <p className="text-sm opacity-70">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex space-x-2 justify-center">
                        <Button onClick={() => processFile(uploadedFile)}>
                          Process Document
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFile(null)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          Upload your prescription
                        </h3>
                        <p className="opacity-80">
                          Drag & drop your file here, or click to browse
                        </p>
                        <p className="text-sm opacity-60">
                          Supports PDF, DOCX, JPG, PNG up to 10MB
                        </p>
                      </div>
                      <Button size="lg" className="w-full max-w-xs">
                        Choose File
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Alternative options */}
              <div className="grid md:grid-cols-2 gap-4">
                <Dialog open={showCameraDialog} onOpenChange={setShowCameraDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-16 flex items-center space-x-3 bg-transparent text-white border-white/40"
                      onClick={startCamera}
                    >
                      <Camera className="h-6 w-6" />
                      <span>Scan Document</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Scan Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={capturePhoto} className="flex-1">
                          Capture Photo
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowCameraDialog(false)
                            const stream = videoRef.current?.srcObject as MediaStream
                            stream?.getTracks().forEach((track) => track.stop())
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-16 flex items-center space-x-3 bg-transparent text-white border-white/40"
                    >
                      <FileText className="h-6 w-6" />
                      <span>Enter Text</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Enter Prescription Text</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type or paste your prescription text here..."
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        rows={6}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleManualTextSubmit}
                          disabled={!manualText.trim()}
                          className="flex-1"
                        >
                          Process Text
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowTextDialog(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
    {/* Footer */}
      <footer className="relative z-10 py-8 px-6 bg-black/60 text-center text-white/70 text-sm">
        © {new Date().getFullYear()} HealthSpeak. All rights reserved.
      </footer>
      </div>
  )
}
