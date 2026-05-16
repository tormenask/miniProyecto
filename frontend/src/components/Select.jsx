import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Select personalizado que mantiene el design system.
 * Props:
 *  - id, name, value, onChange: igual que un <select> nativo
 *  - options: [{ value, label }]
 *  - placeholder: texto cuando no hay valor seleccionado
 *  - error: boolean para mostrar borde de error
 *  - className: clases extra para el contenedor
 */
function Select({ id, name, value, onChange, options, placeholder = 'Selecciona una opción', error = false, className = '' }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef(null)
  const listRef = useRef(null)

  const selected = options.find((o) => o.value === value)
  const optId = (i) => `${id || name}-opt-${i}`

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Inicializar índice activo al abrir, resetear al cerrar
  useEffect(() => {
    if (open) {
      const current = options.findIndex(o => o.value === value)
      setActiveIndex(current >= 0 ? current : 0)
    } else {
      setActiveIndex(-1)
    }
  }, [open])

  // Desplazar opción activa a la vista
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } })
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0) handleSelect(options[activeIndex].value)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={open && activeIndex >= 0 ? optId(activeIndex) : undefined}
        className={[
          'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-left bg-white transition-all outline-none',
          open
            ? 'border border-brand ring-2 ring-brand'
            : error
              ? 'border border-danger-border'
              : 'border border-[#E1E4E7] hover:border-gray-300',
          selected ? 'text-[#1A1A1A]' : 'text-gray-400',
        ].join(' ')}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 ml-2 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={placeholder}
          className="absolute z-50 w-full mt-1 bg-white border border-[#E1E4E7] rounded-lg shadow-lg overflow-hidden"
        >
          <div className="max-h-56 overflow-y-auto py-1">
            {options.map(({ value: val, label }, index) => {
              const isSelected = value === val
              const isFocused = index === activeIndex
              return (
                <li
                  key={val}
                  id={optId(index)}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(val)}
                  className={[
                    'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer select-none transition-colors',
                    isSelected
                      ? 'bg-brand/5 text-brand font-semibold'
                      : isFocused
                        ? 'bg-gray-100 text-[#1A1A1A]'
                        : 'text-[#1A1A1A] hover:bg-gray-50',
                  ].join(' ')}
                >
                  <span>{label}</span>
                  {isSelected && <Check size={14} className="shrink-0 ml-2" aria-hidden="true" />}
                </li>
              )
            })}
          </div>
        </ul>
      )}
    </div>
  )
}

export default Select
