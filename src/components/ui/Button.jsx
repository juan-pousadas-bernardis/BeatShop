// src/components/ui/Button.jsx
import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  icon = null,
  ...rest
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn btn-secondary'
      case 'edit':
        return 'btn btn-edit'
      case 'delete':
        return 'btn btn-delete'
      case 'seed':
        return 'btn-seed'
      case 'primary':
      default:
        return 'btn btn-primary'
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantClass()} ${className}`.trim()}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  )
}

export default Button
