import React, { useState } from 'react'
import { useGasConfig } from '@/contexts/GasConfigContext'
import { Button } from '@/components/ui/buttons'
import { GasConfigPanel } from '@/components/features/GasConfig'

interface GasConfigModalProps {
  className?: string
  buttonText?: string
  showGasStatus?: boolean
}

const GasConfigModal: React.FC<GasConfigModalProps> = ({
  className = '',
  buttonText = 'Gas Settings',
  showGasStatus = true,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { gasConfig, isCustomGasEnabled } = useGasConfig()

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleApply = () => {
    closeModal()
  }

  const getGasStatusText = () => {
    if (!gasConfig.enabled) {
      return 'Automatic'
    }

    if (gasConfig.mode === 'manual') {
      return 'Manual'
    }

    return gasConfig.priorityLevel.charAt(0).toUpperCase() + gasConfig.priorityLevel.slice(1)
  }

  const getGasStatusColor = () => {
    if (!gasConfig.enabled) {
      return 'text-text-secondary'
    }

    if (gasConfig.mode === 'manual') {
      return 'text-orange-500'
    }

    switch (gasConfig.priorityLevel) {
      case 'slow':
        return 'text-blue-500'
      case 'standard':
        return 'text-green-500'
      case 'fast':
        return 'text-yellow-500'
      case 'aggressive':
        return 'text-red-500'
      default:
        return 'text-text-secondary'
    }
  }

  return (
    <div className={className}>
      {/* Gas Configuration Button */}
      <Button onClick={openModal} variant='secondary' className='flex items-center gap-2'>
        <span>⚙️</span>
        <span>{buttonText}</span>
        {showGasStatus && (
          <span className={`text-xs ${getGasStatusColor()}`}>({getGasStatusText()})</span>
        )}
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <GasConfigPanel
              onClose={closeModal}
              onApply={handleApply}
              className='m-0 border-0 rounded-lg'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default GasConfigModal
