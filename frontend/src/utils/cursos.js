export const CURSOS = [
  { value: 'calculo', label: 'Cálculo' },
  { value: 'algebra', label: 'Álgebra Lineal' },
  { value: 'estadistica', label: 'Estadística' },
  { value: 'fisica', label: 'Física' },
  { value: 'quimica', label: 'Química' },
  { value: 'biologia', label: 'Biología' },
  { value: 'programacion', label: 'Programación' },
  { value: 'estructuras', label: 'Estructuras de Datos' },
  { value: 'bases_datos', label: 'Bases de Datos' },
  { value: 'redes', label: 'Redes de Computadores' },
  { value: 'sistemas_op', label: 'Sistemas Operativos' },
  { value: 'ingenieria_sw', label: 'Ingeniería de Software' },
  { value: 'economia', label: 'Economía' },
  { value: 'administracion', label: 'Administración' },
  { value: 'contabilidad', label: 'Contabilidad' },
  { value: 'derecho', label: 'Derecho' },
  { value: 'ingles', label: 'Inglés' },
  { value: 'humanidades', label: 'Humanidades' },
  { value: 'etica', label: 'Ética' },
  { value: 'otro', label: 'Otro' },
]

export const CURSO_LABEL = Object.fromEntries(CURSOS.map(({ value, label }) => [value, label]))
