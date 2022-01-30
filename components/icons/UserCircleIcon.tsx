const UserCircleIcon = () => {
  return (
    <>
      <circle
        cx={12}
        cy={10}
        r={3}
        fill="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} />
      <path
        d="M17.78 18.83a.29.29 0 0 0 .13-.36 5.17 5.17 0 0 0-2.13-2.44A7.24 7.24 0 0 0 12 15c-1.37 0-2.7.36-3.78 1.03a5.17 5.17 0 0 0-2.13 2.44c-.06.14 0 .29.13.36a12.01 12.01 0 0 0 11.56 0Z"
        fill="currentColor"
      />
    </>
  )
}

export default UserCircleIcon