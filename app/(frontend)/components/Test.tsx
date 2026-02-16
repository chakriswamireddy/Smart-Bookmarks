'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export default function RealtimeTest() {
  const supabase = useMemo(() => createClient(), [])

  const [logs, setLogs] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const [inserting, setInserting] = useState(false)

  useEffect(() => {
    const addLog = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString()
      setLogs((l) => [...l, `[${timestamp}] ${msg}`])
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        addLog('  No auth session')
      } else {
        addLog('  Auth session found')
        addLog(` User: ${data.session.user.email}`)
      }
    })

    const channel: RealtimeChannel = supabase
      .channel('realtime-test', {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks2',
        },
        (payload) => {
          addLog(`  ${payload.eventType} event received`)
          addLog(`  Payload: ${JSON.stringify(payload.new || payload.old)}`)
        }
      )
      .subscribe((status, err) => {
        addLog(`🔌 Subscription status: ${status}`)
        
        if (err) {
          addLog(`  Subscription error: ${err.message}`)
        }
        
        if (status === 'SUBSCRIBED') {
          setConnected(true)
          addLog('  Successfully subscribed to realtime changes')
        }
        
        if (status === 'CHANNEL_ERROR') {
          addLog('  Channel error - check Replication settings')
        }
        
        if (status === 'TIMED_OUT') {
          addLog('  Subscription timed out')
        }
      })

    return () => {
      addLog('  Cleaning up subscription')
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleInsert = async () => {
    setInserting(true)
    const timestamp = new Date().toLocaleTimeString()
    
 
    
    const { data, error } = await supabase
      .from('bookmarks2')
      .insert({
        title: `Realtime Test ${Date.now()}`,
        url: 'https://example.com',
      })
      .select()
 
    
    setInserting(false)
  }

  const clearLogs = () => setLogs([])

  return (
    <div className="p-6 border rounded-lg space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg">
          Realtime Status:{' '}
          <span className={connected ? 'text-green-600' : 'text-red-600'}>
            {connected ? '🟢 CONNECTED' : '🔴 NOT CONNECTED'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="border px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={handleInsert}
          disabled={inserting || !connected}
        >
          {inserting ? 'Inserting...' : 'Insert Test Row'}
        </button>
        
        <button
          className="border px-4 py-2 rounded hover:bg-gray-100"
          onClick={clearLogs}
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded text-sm font-mono space-y-1 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-400">Waiting for events...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="border-b border-gray-200 pb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}