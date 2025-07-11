import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useGasConfig } from '@/contexts/GasConfigContext'
import { GasLimits } from '@/types'
import { Button } from '@/components/ui/buttons'
import { BaseInput } from '@/components/ui/inputs'

interface GasConfigPanelProps {
  onClose: () => void
  onApply: () => void
  className?: string
}

const GasConfigPanel: React.FC<GasConfigPanelProps> = ({ onClose, onApply, className = '' }) => {
  const { gasConfig, setGasConfig, resetGasConfig, validateGasLimits, getGasMultiplier } =
    useGasConfig()

  const [localConfig, setLocalConfig] = useState(gasConfig)
  const [customLimits, setCustomLimits] = useState<GasLimits>(gasConfig.customLimits)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setLocalConfig(gasConfig)
    setCustomLimits(gasConfig.customLimits)
  }, [gasConfig])

  const handleModeChange = (mode: 'automatic' | 'manual') => {
    setLocalConfig((prev) => ({ ...prev, mode }))
  }

  const handlePriorityChange = (priorityLevel: 'slow' | 'standard' | 'fast' | 'aggressive') => {
    setLocalConfig((prev) => ({ ...prev, priorityLevel }))
  }

  const handleCustomLimitChange = (field: keyof GasLimits, value: string) => {
    const newLimits = { ...customLimits, [field]: value }
    setCustomLimits(newLimits)

    // Validate the specific field
    if (value && value !== '') {
      try {
        const gasValue = ethers.BigNumber.from(value)
        if (gasValue.lte(0)) {
          setErrors((prev) => ({ ...prev, [field]: 'Gas limit must be greater than 0' }))
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, [field]: 'Invalid number format' }))
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleApply = () => {
    const newConfig = {
      ...localConfig,
      customLimits,
      enabled: localConfig.mode === 'manual' || localConfig.priorityLevel !== 'standard',
    }

    if (localConfig.mode === 'manual' && !validateGasLimits(customLimits)) {
      setErrors((prev) => ({ ...prev, general: 'Invalid gas limits. Please check your values.' }))
      return
    }

    setGasConfig(newConfig)
    onApply()
  }

  const handleReset = () => {
    resetGasConfig()
    setLocalConfig(gasConfig)
    setCustomLimits({})
    setErrors({})
  }

  const multiplier = getGasMultiplier()

  return (
    <div className={`bg-bg-primary border border-border-primary rounded-lg p-6 ${className}`}>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-text-primary'>Gas Configuration</h3>
        <button onClick={onClose} className='text-text-secondary hover:text-text-primary'>
          ✕
        </button>
      </div>

      {/* Mode Selection */}
      <div className='mb-6'>
        <label className='block text-text-secondary text-sm mb-2'>Mode</label>
        <div className='flex gap-2'>
          <button
            onClick={() => handleModeChange('automatic')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              localConfig.mode === 'automatic'
                ? 'bg-primary text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            Automatic
          </button>
          <button
            onClick={() => handleModeChange('manual')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              localConfig.mode === 'manual'
                ? 'bg-primary text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Priority Level (for automatic mode) */}
      {localConfig.mode === 'automatic' && (
        <div className='mb-6'>
          <label className='block text-text-secondary text-sm mb-2'>
            Priority Level (Multiplier: {multiplier}x)
          </label>
          <div className='grid grid-cols-2 gap-2'>
            {(['slow', 'standard', 'fast', 'aggressive'] as const).map((level) => (
              <button
                key={level}
                onClick={() => handlePriorityChange(level)}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                  localConfig.priorityLevel === level
                    ? 'bg-primary text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Gas Limits */}
      {localConfig.mode === 'manual' && (
        <div className='mb-6'>
          <label className='block text-text-secondary text-sm mb-3'>Custom Gas Limits</label>
          <div className='space-y-4'>
            <div>
              <label className='block text-text-secondary text-xs mb-1'>Call Gas Limit</label>
              <BaseInput
                type='text'
                placeholder='e.g., 100000'
                value={customLimits.callGasLimit || ''}
                onChange={(value) => handleCustomLimitChange('callGasLimit', value)}
                className={errors.callGasLimit ? 'border-red-500' : ''}
              />
              {errors.callGasLimit && (
                <span className='text-red-500 text-xs mt-1'>{errors.callGasLimit}</span>
              )}
            </div>

            <div>
              <label className='block text-text-secondary text-xs mb-1'>
                Verification Gas Limit
              </label>
              <BaseInput
                type='text'
                placeholder='e.g., 150000'
                value={customLimits.verificationGasLimit || ''}
                onChange={(value) => handleCustomLimitChange('verificationGasLimit', value)}
                className={errors.verificationGasLimit ? 'border-red-500' : ''}
              />
              {errors.verificationGasLimit && (
                <span className='text-red-500 text-xs mt-1'>{errors.verificationGasLimit}</span>
              )}
            </div>

            <div>
              <label className='block text-text-secondary text-xs mb-1'>Pre-verification Gas</label>
              <BaseInput
                type='text'
                placeholder='e.g., 21000'
                value={customLimits.preVerificationGas || ''}
                onChange={(value) => handleCustomLimitChange('preVerificationGas', value)}
                className={errors.preVerificationGas ? 'border-red-500' : ''}
              />
              {errors.preVerificationGas && (
                <span className='text-red-500 text-xs mt-1'>{errors.preVerificationGas}</span>
              )}
            </div>

            <div>
              <label className='block text-text-secondary text-xs mb-1'>
                Max Fee Per Gas (wei)
              </label>
              <BaseInput
                type='text'
                placeholder='e.g., 20000000000'
                value={customLimits.maxFeePerGas || ''}
                onChange={(value) => handleCustomLimitChange('maxFeePerGas', value)}
                className={errors.maxFeePerGas ? 'border-red-500' : ''}
              />
              {errors.maxFeePerGas && (
                <span className='text-red-500 text-xs mt-1'>{errors.maxFeePerGas}</span>
              )}
            </div>

            <div>
              <label className='block text-text-secondary text-xs mb-1'>
                Max Priority Fee Per Gas (wei)
              </label>
              <BaseInput
                type='text'
                placeholder='e.g., 2000000000'
                value={customLimits.maxPriorityFeePerGas || ''}
                onChange={(value) => handleCustomLimitChange('maxPriorityFeePerGas', value)}
                className={errors.maxPriorityFeePerGas ? 'border-red-500' : ''}
              />
              {errors.maxPriorityFeePerGas && (
                <span className='text-red-500 text-xs mt-1'>{errors.maxPriorityFeePerGas}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.general && (
        <div className='mb-4 p-3 bg-red-100 border border-red-300 rounded-lg'>
          <span className='text-red-700 text-sm'>{errors.general}</span>
        </div>
      )}

      {/* Warning Message */}
      <div className='mb-6 p-3 bg-yellow-100 border border-yellow-300 rounded-lg'>
        <p className='text-yellow-700 text-sm'>
          <strong>Warning:</strong> Setting gas limits too low may cause transaction failures.
          Setting them too high may result in unnecessary fees.
        </p>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3'>
        <Button onClick={handleApply} className='flex-1' variant='primary'>
          Apply Settings
        </Button>
        <Button onClick={handleReset} className='flex-1' variant='secondary'>
          Reset to Default
        </Button>
      </div>
    </div>
  )
}

export default GasConfigPanel
