export const CURSOS = [
  { value: 'calculo',               label: 'Cálculo' },
  { value: 'algebra',               label: 'Álgebra Lineal' },
  { value: 'estadistica',           label: 'Estadística' },
  { value: 'programacion',          label: 'Programación' },
  { value: 'estructuras_de_datos',  label: 'Estructuras de Datos' },
  { value: 'bases_de_datos',        label: 'Bases de Datos' },
  { value: 'redes',                 label: 'Redes de Computadores' },
  { value: 'sistemas_operativos',   label: 'Sistemas Operativos' },
  { value: 'ingenieria_de_software',label: 'Ingeniería de Software' },
  { value: 'arquitectura',          label: 'Arquitectura de Computadores' },
  { value: 'inteligencia_artificial',label: 'Inteligencia Artificial' },
  { value: 'fisica',                label: 'Física' },
  { value: 'quimica',               label: 'Química' },
  { value: 'economia',              label: 'Economía' },
  { value: 'contabilidad',          label: 'Contabilidad' },
  { value: 'administracion',        label: 'Administración' },
  { value: 'comunicacion',          label: 'Comunicación' },
  { value: 'humanidades',           label: 'Humanidades / Electiva' },
  { value: 'proyecto_integrador',   label: 'Proyecto Integrador' },
  { value: 'otro',                  label: 'Otro' },
]

export const CURSO_LABEL = Object.fromEntries(CURSOS.map(({ value, label }) => [value, label]))
