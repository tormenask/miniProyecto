import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Select personalizado que mantiene el design system.
 * Props:
 *  - name, value, onChange: igual que un <select> nativo
 *  - options: [{ value, label }]
 *  - placeholder: texto cuando no hay valor seleccionado
 *  - error: boolean para mostrar borde de error
 *  - className: clases extra para el contenedor
 */
function Select({ name, value, onChange, options, placeholder = 'Selecciona una opción', error = false, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find((o) => o.value === value)

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } })
    setOpen(false)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
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
          className={`shrink-0 ml-2 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-[#E1E4E7] rounded-lg shadow-lg overflow-hidden"
        >
          <div className="max-h-56 overflow-y-auto py-1">
            {options.map(({ value: val, label }) => {
              const isSelected = value === val
              return (
                <li
                  key={val}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(val)}
                  className={[
                    'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer select-none transition-colors',
                    isSelected
                      ? 'bg-brand/5 text-brand font-semibold'
                      : 'text-[#1A1A1A] hover:bg-gray-50',
                  ].join(' ')}
                >
                  <span>{label}</span>
                  {isSelected && <Check size={14} className="shrink-0 ml-2" />}
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
