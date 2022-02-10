const LockIcon = () => {
  return (
    <>
      <path
        d="M4 13c0-1.89 0-2.83.59-3.41C5.17 9 6.1 9 8 9h8c1.89 0 2.83 0 3.41.59.59.58.59 1.52.59 3.41v2c0 2.83 0 4.24-.88 5.12-.88.88-2.3.88-5.12.88h-4c-2.83 0-4.24 0-5.12-.88C4 19.24 4 17.82 4 15v-2Z"
        stroke="currentColor"
        strokeWidth={2.5}
      />
      <path
        d="M16 8V7a4 4 0 0 0-4-4v0a4 4 0 0 0-4 4v1"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={12} cy={15} r={2} fill="currentColor" />
    </>
  )
}

export default LockIcon