import { useState, useEffect } from 'react'
import { ERC20_ABI } from '@/constants/abi'
// import CreateTokenFactory from '@/abis/ERC20/CreateTokenFactory.json'
import { useSignature, useSendUserOp } from '@/hooks'

const Sample = () => {
  const { AAaddress, isConnected } = useSignature()
  const { execute, waitForUserOpResult, checkUserOpStatus } = useSendUserOp()
  const [isLoading, setIsLoading] = useState(false)
  const [userOpHash, setUserOpHash] = useState<string | null>(null)
  const [txStatus, setTxStatus] = useState<string>('')
  const [isPolling, setIsPolling] = useState(false)
  const [storageStatus, setStorageStatus] = useState<string>('')

  // Function to fill localStorage
  const fillLocalStorage = async () => {
    try {
      let i = 0
      const largeString = 'x'.repeat(100000) // 100KB chunks

      while (true) {
        const key = `test_storage_fill_${i}`
        localStorage.setItem(key, largeString)
        i++
        setStorageStatus(`Added ${i} chunks (${Math.round(i * 100)}KB)`)

        // Yield control to prevent UI blocking
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 10))
        }
      }
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        setStorageStatus('✅ localStorage is now FULL! Try creating an account to see the warning.')
      } else {
        setStorageStatus(`Error: ${error.message}`)
      }
    }
  }

  // Function to clear test storage
  const clearTestStorage = () => {
    try {
      const keys = Object.keys(localStorage)
      let cleared = 0

      keys.forEach((key) => {
        if (key.startsWith('test_storage_fill_')) {
          localStorage.removeItem(key)
          cleared++
        }
      })

      setStorageStatus(`✅ Cleared ${cleared} test items. localStorage space restored.`)
    } catch (error: any) {
      setStorageStatus(`Error clearing: ${error.message}`)
    }
  }

  useEffect(() => {
    let intervalId: number | null = null

    const pollStatus = async () => {
      if (!userOpHash || !isPolling) return

      try {
        const status = await checkUserOpStatus(userOpHash)
        if (status === true) {
          setTxStatus('成功しました！')
          setIsPolling(false)
        } else {
          setTxStatus('失敗しました')
          setIsPolling(false)
        }
      } catch (error) {
        console.error('ステータス確認エラー:', error)
        setTxStatus('エラーが発生しました')
        setIsPolling(false)
      }
    }

    if (userOpHash && isPolling) {
      setTxStatus('処理中...')
      intervalId = window.setInterval(pollStatus, 3000) as unknown as number // 3秒ごとにステータスを確認
      pollStatus()
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [userOpHash, isPolling, checkUserOpStatus])

  const handleExecute = async () => {
    if (!isConnected) {
      alert('not connected')
      return
    }

    setIsLoading(true)
    setUserOpHash(null)
    setTxStatus('')

    try {
      await execute({
        function: 'approve',
        contractAddress: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        abi: ERC20_ABI,
        value: 0,
        params: ['0x5a6680dfd4a77feea0a7be291147768eaa2414ad', BigInt(1000000000000000000)],
      })

      // await execute({
      //   function: 'createToken',
      //   contractAddress: '0x00ef47f5316A311870fe3F3431aA510C5c2c5a90',
      //   abi: CreateTokenFactory.abi,
      //   params: ['test', 'aiueo', '100000000'],
      // })

      const result = await waitForUserOpResult()
      setUserOpHash(result.userOpHash)

      setIsPolling(true)

      if (result.result === true) {
        setTxStatus('成功しました！')
        setIsPolling(false)
      } else if (result.transactionHash) {
        setTxStatus('トランザクションハッシュ: ' + result.transactionHash)
      }
    } catch (error) {
      console.error('実行エラー:', error)
      setTxStatus('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: '40px 30px',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '1.2rem',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        {AAaddress}
      </p>

      {/* Storage Test Section */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '2px solid #007bff',
          maxWidth: '500px',
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>📦 localStorage Test</h3>
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={fillLocalStorage}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: '4px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              marginRight: '10px',
            }}
          >
            🔴 Fill localStorage
          </button>
          <button
            onClick={clearTestStorage}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: '4px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
            }}
          >
            🟢 Clear Test Data
          </button>
        </div>
        {storageStatus && (
          <p
            style={{
              fontSize: '12px',
              color: '#666',
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              margin: 0,
              wordBreak: 'break-word',
            }}
          >
            {storageStatus}
          </p>
        )}
        <p
          style={{
            fontSize: '11px',
            color: '#999',
            margin: '10px 0 0 0',
            fontStyle: 'italic',
          }}
        >
          💡 Fill storage, then try creating a new account to see the warning!
        </p>
      </div>

      <button
        onClick={handleExecute}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
        }}
      >
        {isLoading ? '実行中...' : 'Sample send userOp'}
      </button>

      {userOpHash && (
        <div style={{ marginTop: '20px', maxWidth: '500px' }}>
          <p style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
            <strong>UserOpHash:</strong> {userOpHash}
          </p>
          <p
            style={{
              marginTop: '10px',
              color: txStatus.includes('成功')
                ? 'green'
                : txStatus.includes('失敗')
                  ? 'red'
                  : 'blue',
            }}
          >
            <strong>ステータス:</strong> {txStatus || '不明'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Sample
