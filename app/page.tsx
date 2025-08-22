"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, FileText, X, CheckCircle, AlertCircle } from "lucide-react"

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
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
          const file = new File([blob], "captured-document.png", { type: "image/png" })
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

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />

      <div className="md:ml-64">
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Translate Your Document</h1>
              <p className="text-xl text-muted-foreground">
                Get a plain language version of your medical records in seconds.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Processing State */}
            {isProcessing && (
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Processing your document...</h3>
                    <p className="text-muted-foreground">Please wait while we analyze your medical document.</p>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </Card>
            )}

            {/* Upload area - only show when not processing */}
            {!isProcessing && (
              <>
                <Card
                  className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : uploadedFile
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-border hover:border-primary"
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
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">File Ready</h3>
                          <p className="text-muted-foreground">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex space-x-2 justify-center">
                          <Button onClick={() => processFile(uploadedFile)}>Process Document</Button>
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
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Upload your prescription</h3>
                          <p className="text-muted-foreground">Drag & drop your file here, or click to browse</p>
                          <p className="text-sm text-muted-foreground">Supports PDF, DOCX, JPG, PNG up to 10MB</p>
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
                        className="h-16 flex items-center space-x-3 bg-transparent"
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
                      <Button variant="outline" size="lg" className="h-16 flex items-center space-x-3 bg-transparent">
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
                          <Button onClick={handleManualTextSubmit} disabled={!manualText.trim()} className="flex-1">
                            Process Text
                          </Button>
                          <Button variant="outline" onClick={() => setShowTextDialog(false)}>
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
    </div>
  )
}
