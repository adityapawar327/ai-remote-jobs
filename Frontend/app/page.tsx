"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  Search,
  FileText,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  ExternalLink,
  Download,
  Share2,
  SortAsc,
  Moon,
  Sun,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"

// Types
interface Job {
  position: string
  company: string
  salary: string
  location: string
  tags: string[]
  apply_url: string
  date_posted: string
  description: string
  relevance_score: number
  matched_keywords: string[]
}

interface ResumeInfo {
  skills: string[]
  experience: string[]
  education: string[]
  technologies: string[]
  job_titles: string[]
  industries: string[]
  years_of_experience: number
  preferred_roles: string[]
}

interface SearchFilters {
  skills: string[]
  technologies: string[]
  job_titles: string[]
  industries: string[]
  limit: number
}

const API_BASE_URL = "http://localhost:8000"

export default function ResumeJobMatcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("upload")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [jobs, setJobs] = useState<Job[]>([])
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobLimit, setJobLimit] = useState([20])
  const [isDragOver, setIsDragOver] = useState(false)

  // Manual search states
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    skills: [],
    technologies: [],
    job_titles: [],
    industries: [],
    limit: 20,
  })
  const [currentInput, setCurrentInput] = useState("")
  const [currentInputType, setCurrentInputType] = useState<keyof SearchFilters>("skills")

  // Results states
  const [sortBy, setSortBy] = useState("relevance_score")
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())

  // Health check on mount
  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (!response.ok) {
        setError("API server is not responding. Please ensure the backend is running on http://localhost:8000")
      }
    } catch (err) {
      setError("Cannot connect to API server. Please ensure the backend is running on http://localhost:8000")
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("resume", selectedFile)
      formData.append("job_limit", jobLimit[0].toString())

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch(`${API_BASE_URL}/parse-resume`, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Failed to parse resume")
      }

      const data = await response.json()
      setJobs(data.jobs || [])
      setResumeInfo(data.resume_info || null)
      setSuccess("Resume parsed successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse resume")
    } finally {
      setIsLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleManualSearch = async () => {
    if (
      searchFilters.skills.length === 0 &&
      searchFilters.technologies.length === 0 &&
      searchFilters.job_titles.length === 0 &&
      searchFilters.industries.length === 0
    ) {
      setError("Please add at least one search criteria")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/search-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchFilters),
      })

      if (!response.ok) {
        throw new Error("Failed to search jobs")
      }

      const data = await response.json()
      setJobs(data.jobs || [])
      setSuccess("Job search completed!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search jobs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const addToSearchFilter = (type: keyof SearchFilters, value: string) => {
    if (value.trim() && !searchFilters[type].includes(value.trim())) {
      setSearchFilters((prev) => ({
        ...prev,
        [type]: [...(prev[type] as string[]), value.trim()],
      }))
    }
    setCurrentInput("")
  }

  const removeFromSearchFilter = (type: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [type]: (prev[type] as string[]).filter((item) => item !== value),
    }))
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case "relevance_score":
        return b.relevance_score - a.relevance_score
      case "date_posted":
        return new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
      case "salary":
        const aSalary = Number.parseInt(a.salary.replace(/[^0-9]/g, "")) || 0
        const bSalary = Number.parseInt(b.salary.replace(/[^0-9]/g, "")) || 0
        return bSalary - aSalary
      default:
        return 0
    }
  })

  const filteredJobs = sortedJobs.filter((job) => {
    if (filterTags.length === 0) return true
    return filterTags.some(
      (tag) =>
        job.tags.some((jobTag) => jobTag.toLowerCase().includes(tag.toLowerCase())) ||
        job.matched_keywords.some((keyword) => keyword.toLowerCase().includes(tag.toLowerCase())),
    )
  })

  const toggleJobExpansion = (index: number) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedJobs(newExpanded)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Parser & Job Matcher</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Find Your Perfect Job Match</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload your resume or search manually to discover job opportunities that match your skills and experience
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">{success}</span>
            <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Resume</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Manual Search</span>
            </TabsTrigger>
          </TabsList>

          {/* Resume Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Upload Your Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your PDF resume to automatically extract skills and find matching jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedFile ? selectedFile.name : "Drop your resume here"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">or click to browse (PDF only, max 10MB)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Job Limit Slider */}
                <div className="space-y-2">
                  <Label>Number of jobs to find: {jobLimit[0]}</Label>
                  <Slider value={jobLimit} onValueChange={setJobLimit} max={50} min={5} step={5} className="w-full" />
                </div>

                {/* Upload Button */}
                <Button onClick={handleFileUpload} disabled={!selectedFile || isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Parsing Resume...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Parse Resume & Find Jobs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Manual Job Search</span>
                </CardTitle>
                <CardDescription>
                  Enter your skills, technologies, and preferences to find matching jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Filters */}
                {(["skills", "technologies", "job_titles", "industries"] as const).map((filterType) => (
                  <div key={filterType} className="space-y-2">
                    <Label className="capitalize">{filterType.replace("_", " ")}</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder={`Add ${filterType.replace("_", " ")}...`}
                        value={currentInputType === filterType ? currentInput : ""}
                        onChange={(e) => {
                          setCurrentInput(e.target.value)
                          setCurrentInputType(filterType)
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addToSearchFilter(filterType, currentInput)
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addToSearchFilter(filterType, currentInput)}
                        disabled={!currentInput.trim() || currentInputType !== filterType}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchFilters[filterType].map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{item}</span>
                          <button
                            onClick={() => removeFromSearchFilter(filterType, item)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Job Limit */}
                <div className="space-y-2">
                  <Label>Number of jobs to find: {searchFilters.limit}</Label>
                  <Slider
                    value={[searchFilters.limit]}
                    onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, limit: value[0] }))}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Search Button */}
                <Button onClick={handleManualSearch} disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching Jobs...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Jobs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results Section */}
        {(jobs.length > 0 || resumeInfo) && (
          <div className="mt-12 space-y-8">
            <Separator />

            {/* Resume Analysis */}
            {resumeInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Resume Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {resumeInfo.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-1">
                        {resumeInfo.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Experience</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{resumeInfo.years_of_experience} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Jobs Results */}
            {jobs.length > 0 && (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Found {filteredJobs.length} Jobs</h3>

                  <div className="flex flex-wrap gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SortAsc className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance_score">Sort by Relevance</SelectItem>
                        <SelectItem value="date_posted">Sort by Date</SelectItem>
                        <SelectItem value="salary">Sort by Salary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Job Cards */}
                <div className="grid gap-6">
                  {filteredJobs.map((job, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Job Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{job.position}</h4>
                              <p className="text-lg text-gray-600 dark:text-gray-400">{job.company}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{(job.relevance_score * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={job.relevance_score * 100} className="w-20" />
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-600" />
                              <span>{new Date(job.date_posted).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Technologies:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {job.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {job.matched_keywords.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Matched Keywords:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {job.matched_keywords.map((keyword, keywordIndex) => (
                                    <Badge key={keywordIndex} variant="secondary">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {expandedJobs.has(index) ? job.description : `${job.description.substring(0, 200)}...`}
                            </p>
                            {job.description.length > 200 && (
                              <Button variant="link" className="p-0 h-auto" onClick={() => toggleJobExpansion(index)}>
                                {expandedJobs.has(index) ? "Read Less" : "Read More"}
                              </Button>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button asChild>
                              <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Apply Now
                              </a>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Export Options */}
                <div className="flex justify-center space-x-4 pt-8">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {jobs.length === 0 &&
          !isLoading &&
          (activeTab === "upload"
            ? selectedFile
            : Object.values(searchFilters).some((v) => (Array.isArray(v) ? v.length > 0 : false))) && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Jobs Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or upload a different resume
              </p>
            </div>
          )}
      </div>
    </div>
  )
}
