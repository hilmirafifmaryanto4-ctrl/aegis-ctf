"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Shield, Plus, Trash2, Users, List, Trophy, Upload, X, FileText, Megaphone, Lightbulb, Activity, Eye, EyeOff, Flag } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [challenges, setChallenges] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [solves, setSolves] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChallenges: 0,
    totalSolves: 0,
    visibleChallenges: 0
  })
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    description: "",
    points: 100,
    flag: "",
    files: [] as string[],
    type: "standard",
    state: "visible",
    initial_points: 100,
    minimum_points: 100,
    decay: 0,
    hints: [] as { content: string, cost: number }[]
  })
  const [announcementContent, setAnnouncementContent] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // ... (rest of the code)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('challenge-files')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('challenge-files')
        .getPublicUrl(filePath)

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, publicUrl]
      }))
    } catch (error: any) {
      alert('Error uploading file: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }))
  }

  // Check Admin Access
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsAdmin(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (profile?.role === 'admin') {
        setIsAdmin(true)
        fetchChallenges()
        fetchUsers()
        fetchAnnouncements()
        fetchSolves()
      }
    }
    checkAdmin()
  }, [])

  // Real-time updates for Admin Dashboard
  useEffect(() => {
    if (!isAdmin) return

    const channel = supabase.channel('admin_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, () => {
        fetchChallenges()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solves' }, () => {
        fetchSolves()
        fetchUsers() // Scores might change
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUsers()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncements()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdmin])

  useEffect(() => {
    if (challenges.length > 0 && users.length > 0 && solves.length > 0) {
      setStats({
        totalUsers: users.length,
        totalChallenges: challenges.length,
        totalSolves: solves.length,
        visibleChallenges: challenges.filter(c => c.state === 'visible').length
      })
    }
  }, [challenges, users, solves])

  const fetchChallenges = async () => {
    const { data } = await supabase.from('challenges').select('*').order('created_at', { ascending: false })
    if (data) setChallenges(data)
  }

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setUsers(data)
  }

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    if (data) setAnnouncements(data)
  }

  const fetchSolves = async () => {
    const { data } = await supabase
      .from('solves')
      .select('*, profiles:user_id(username), challenges:challenge_id(title)')
      .order('created_at', { ascending: false })
    if (data) setSolves(data)
  }

  const handleClaimOwner = async () => {
    try {
      const { error } = await supabase.rpc('claim_owner', { secret_key: 'AEGIS_OWNER_2026' })
      if (error) throw error
      alert("Success! You are now an admin. Reloading...")
      window.location.reload()
    } catch (error: any) {
      alert("Failed to claim owner: " + error.message)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return
    const { error } = await supabase.from('challenges').delete().eq('id', id)
    if (error) {
      alert("Error deleting: " + error.message)
    } else {
      fetchChallenges()
    }
  }

  const handleDeleteSolve = async (id: string) => {
    if (!confirm("Revoke this solve? Points will be deducted.")) return
    const { error } = await supabase.from('solves').delete().eq('id', id)
    if (error) alert("Error: " + error.message)
    else fetchSolves()
  }

  const handleToggleVisibility = async (id: string, currentState: string) => {
    const newState = currentState === 'visible' ? 'hidden' : 'visible'
    const { error } = await supabase.from('challenges').update({ state: newState }).eq('id', id)
    if (!error) fetchChallenges()
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) fetchAnnouncements()
    else fetchAnnouncements()
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementContent.trim()) return
    
    const { error } = await supabase.from('announcements').insert([{ content: announcementContent }])
    if (error) {
      alert("Error: " + error.message)
    } else {
      setAnnouncementContent("")
      fetchAnnouncements()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // 1. Insert Challenge
    const { data: challenge, error } = await supabase.from('challenges').insert([{
      title: formData.title,
      category: formData.category,
      description: formData.description,
      points: formData.type === 'dynamic' ? formData.initial_points : formData.points,
      flag: formData.flag,
      files: formData.files,
      type: formData.type,
      state: formData.state,
      initial_points: formData.initial_points,
      minimum_points: formData.minimum_points,
      decay: formData.decay
    }]).select().single()

    if (error) {
      setMessage("Error creating challenge: " + error.message)
    } else {
      // 2. Insert Hints if any
      if (formData.hints.length > 0 && challenge) {
        const hintsToInsert = formData.hints.map(h => ({
          challenge_id: challenge.id,
          content: h.content,
          cost: h.cost
        }))
        await supabase.from('hints').insert(hintsToInsert)
      }

      setMessage("Challenge created successfully!")
      setFormData({
        title: "",
        category: "Web",
        description: "",
        points: 100,
        flag: "",
        files: [],
        type: "standard",
        state: "visible",
        initial_points: 100,
        minimum_points: 100,
        decay: 0,
        hints: []
      })
      fetchChallenges()
    }
    setLoading(false)
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-32 text-center text-white">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-2">You do not have permission to view this page.</p>
          <div className="mt-8">
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={handleClaimOwner}
            >
              <Shield className="mr-2 h-4 w-4" />
              Claim Owner Access
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/20 text-red-500">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage challenges, users, and settings</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`pb-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "dashboard" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab("challenges")}
              className={`pb-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "challenges" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Challenges
              </div>
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`pb-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "create" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create
              </div>
            </button>
            <button
              onClick={() => setActiveTab("solves")}
              className={`pb-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "solves" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Solves
              </div>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "users" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`pb-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "announcements" 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Announcements
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Users</span>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Challenges</span>
                    <List className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalChallenges} <span className="text-sm text-muted-foreground font-normal">({stats.visibleChallenges} visible)</span></div>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Solves</span>
                    <Flag className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.totalSolves}</div>
                </div>
              </div>
            )}

            {activeTab === "challenges" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenges.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">No challenges found.</div>
                  ) : (
                    challenges.map((challenge) => (
                      <div key={challenge.id} className={`rounded-xl border ${challenge.state === 'hidden' ? 'border-red-500/30 bg-red-950/10' : 'border-white/10 bg-white/5'} p-6 space-y-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                              {challenge.state === 'hidden' && <EyeOff className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary mt-1 inline-block">
                              {challenge.category}
                            </span>
                          </div>
                          <span className="text-yellow-500 font-bold">{challenge.points} pts</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
                        <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleVisibility(challenge.id, challenge.state)}
                            title={challenge.state === 'visible' ? "Hide Challenge" : "Show Challenge"}
                          >
                            {challenge.state === 'visible' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "create" && (
              <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8">
                <h2 className="text-xl font-bold text-white mb-6">Create New Challenge</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      placeholder="e.g. SQL Injection 101"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        <option value="Web">Web Exploitation</option>
                        <option value="Crypto">Cryptography</option>
                        <option value="Pwn">Pwn / Binary</option>
                        <option value="Forensics">Forensics</option>
                        <option value="Reverse">Reverse Engineering</option>
                        <option value="Misc">Miscellaneous</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Visibility</label>
                      <select 
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        <option value="visible">Visible (Public)</option>
                        <option value="hidden">Hidden (Draft)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Points Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-white">
                        <input 
                          type="radio" 
                          name="type" 
                          value="standard"
                          checked={formData.type === 'standard'}
                          onChange={() => setFormData({...formData, type: 'standard'})}
                        />
                        Standard
                      </label>
                      <label className="flex items-center gap-2 text-white">
                        <input 
                          type="radio" 
                          name="type" 
                          value="dynamic"
                          checked={formData.type === 'dynamic'}
                          onChange={() => setFormData({...formData, type: 'dynamic'})}
                        />
                        Dynamic
                      </label>
                    </div>
                  </div>

                  {formData.type === 'standard' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Points</label>
                      <input 
                        type="number"
                        required
                        value={formData.points}
                        onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Initial</label>
                        <input 
                          type="number"
                          value={formData.initial_points}
                          onChange={e => setFormData({...formData, initial_points: parseInt(e.target.value)})}
                          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Minimum</label>
                        <input 
                          type="number"
                          value={formData.minimum_points}
                          onChange={e => setFormData({...formData, minimum_points: parseInt(e.target.value)})}
                          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Decay</label>
                        <input 
                          type="number"
                          value={formData.decay}
                          onChange={e => setFormData({...formData, decay: parseInt(e.target.value)})}
                          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Description (Markdown supported)</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      placeholder="Describe the challenge... Example: 'Analyze the attached PCAP file using Wireshark to find the flag.'"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Challenge Files</label>
                    
                    {/* File List */}
                    {formData.files.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {formData.files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/10 border border-white/10">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-xs text-white truncate">{file.split('/').pop()}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploading}
                      />
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-white/5">
                        {uploading ? (
                          <div className="animate-pulse text-sm text-primary">Uploading...</div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-white font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">Support for PCAP, Binary, Zip, etc.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Flag</label>
                    <input 
                      required
                      value={formData.flag}
                      onChange={e => setFormData({...formData, flag: e.target.value})}
                      className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      placeholder="AEGIS{secret_flag_here}"
                    />
                  </div>

                  {/* Hints Section */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-white">Hints</label>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => setFormData({...formData, hints: [...formData.hints, { content: "", cost: 0 }]})}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Hint
                      </Button>
                    </div>
                    {formData.hints.map((hint, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                          <input 
                            placeholder="Hint content..."
                            value={hint.content}
                            onChange={e => {
                              const newHints = [...formData.hints]
                              newHints[idx].content = e.target.value
                              setFormData({...formData, hints: newHints})
                            }}
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Cost:</span>
                            <input 
                              type="number"
                              placeholder="0"
                              value={hint.cost}
                              onChange={e => {
                                const newHints = [...formData.hints]
                                newHints[idx].cost = parseInt(e.target.value)
                                setFormData({...formData, hints: newHints})
                              }}
                              className="w-20 rounded-md border border-white/10 bg-black/20 px-2 py-1 text-white text-sm"
                            />
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500"
                          onClick={() => {
                            const newHints = formData.hints.filter((_, i) => i !== idx)
                            setFormData({...formData, hints: newHints})
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {message && (
                    <div className={`p-4 rounded-md ${message.includes("Error") ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
                      {message}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Challenge"}
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "solves" && (
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="p-4">Time</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Challenge</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {solves.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">No solves yet.</td>
                      </tr>
                    ) : (
                      solves.map((solve) => (
                        <tr key={solve.id} className="text-muted-foreground hover:bg-white/5">
                          <td className="p-4">{new Date(solve.created_at).toLocaleString()}</td>
                          <td className="p-4 font-medium text-white">{solve.profiles?.username || "Unknown"}</td>
                          <td className="p-4 text-primary">{solve.challenges?.title || "Unknown"}</td>
                          <td className="p-4 text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteSolve(solve.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "users" && (
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="p-4">Username</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user.id} className="text-muted-foreground hover:bg-white/5">
                        <td className="p-4 font-medium text-white">{user.username || "N/A"}</td>
                        <td className="p-4">{user.full_name || "N/A"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="p-4">{new Date(user.updated_at || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "announcements" && (
              <div className="space-y-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Create Announcement</h3>
                  <form onSubmit={handleCreateAnnouncement} className="flex gap-4">
                    <input 
                      value={announcementContent}
                      onChange={e => setAnnouncementContent(e.target.value)}
                      className="flex-1 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      placeholder="Enter announcement..."
                    />
                    <Button type="submit">Post</Button>
                  </form>
                </div>

                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex justify-between items-center">
                      <div>
                        <p className="text-white">{a.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString()}</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(a.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}