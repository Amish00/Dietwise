import { useState } from 'react'
import { Settings as SettingsIcon, Key, Eye, EyeOff, ExternalLink, CheckCircle, Trash2, Wifi, WifiOff } from 'lucide-react'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Badge from '../components/ui/Badge'

const Settings = () => {
  const [testing, setTesting]       = useState(false)
  const [testResult, setTestResult] = useState(null)

  const test = async () => {
    setTesting(true); setTestResult(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:'Bearer abc123' },
        body: JSON.stringify({ model:'llama-3.3-70b-versatile', max_tokens:5, messages:[{ role:'user', content:'Hi' }] }),
      })
      setTestResult(res.ok ? 'success' : 'error')
    } catch { setTestResult('error') }
    setTesting(false)
  }

  const clearAll = () => {
    if (window.confirm('Delete ALL your meals, exercises, profile, and plans? This cannot be undone.')) {
      localStorage.removeItem('dietwise_state')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <SettingsIcon size={26} className="text-primary" /> Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your DietWise configuration.</p>
      </div>

      {/* API Status */}
      <Card>
        <CardTitle>AI Configuration</CardTitle>
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Key size={18} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">Groq API Key</p>
            <p className="text-xs text-gray-500 font-mono">gsk_••••••••••••••••••••</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Configured
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl mb-4">
          <div>
            <p className="text-sm font-bold text-gray-700">Model</p>
            <p className="text-xs text-gray-400 font-mono">llama-3.3-70b-versatile</p>
          </div>
          <Badge color="purple">Active</Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={test} disabled={testing} size="sm">
            {testing ? 'Testing...' : <><Wifi size={13} />Test Connection</>}
          </Button>
        </div>

        {testResult === 'success' && (
          <Alert type="success" className="mt-3">
            <CheckCircle size={14} className="inline mr-1.5" />Connection successful! AI features are working.
          </Alert>
        )}
        {testResult === 'error' && (
          <Alert type="error" className="mt-3">
            <WifiOff size={14} className="inline mr-1.5" />Connection failed. Check your network or API key.
          </Alert>
        )}
      </Card>

      {/* Features */}
      <Card>
        <CardTitle>AI Features</CardTitle>
        <div className="divide-y divide-gray-50">
          {[
            ['Meal Logger AI Coach',        'Analyzes your daily meals and gives personalized diet advice'],
            ['AI Recipe Finder',            'Generates detailed recipes with images and YouTube links'],
            ['7-Day Meal Plan Generator',   'Builds a full week of meals tailored to your goals'],
          ].map(([feature, desc]) => (
            <div key={feature} className="flex items-center gap-3 py-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{feature}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Badge color="green">Active</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* About */}
      <Card>
        <CardTitle>About DietWise</CardTitle>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between"><span className="font-semibold text-gray-700">Version</span><span>2.0.0</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-700">AI Model</span><span>Llama 3.3 70B (Groq)</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-700">Framework</span><span>React 18 + Vite + Tailwind</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-700">Storage</span><span>Local (browser only)</span></div>
        </div>
        <a href="https://console.groq.com/docs" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-primary hover:underline">
          Groq Documentation <ExternalLink size={11} />
        </a>
      </Card>

      {/* Danger */}
      <Card className="border-red-200">
        <CardTitle>Danger Zone</CardTitle>
        <p className="text-sm text-gray-500 mb-4">These actions are permanent and cannot be undone.</p>
        <Button variant="danger" onClick={clearAll} size="sm">
          <Trash2 size={13} /> Reset All Data
        </Button>
      </Card>
    </div>
  )
}
export default Settings
