const George = () => {
  return (
    <>
      <path
        d="m8.55 21.32 1.58 7.77h9.2l1.68-7.77"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <mask id="b" fill="#fff">
        <rect x={6.3} y={16.77} width={16.96} height={5.49} rx={1} />
      </mask>
      <rect
        x={6.3}
        y={16.77}
        width={16.96}
        height={5.49}
        rx={1}
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinejoin="round"
        mask="url(#b)"
      />
      <path
        d="M3.4 7.57c2.4 2.83 3.07 9.11 9.99 5.56.45-2.29-.1-4.49-2.78-5.92-2.68-1.44-7.21.36-7.21.36Zm23.2 2.21c-3.29 2.77-5.1 7.23-9.6 3.86-.14-1.87.4-3.69 2.57-4.8 2.16-1.13 7.03.94 7.03.94Z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path
        d="M14.3 17.6c.15-.8.44-1.6-.13-2.88-.65-1.44-1.24-2.09-1.55-2.48"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path
        d="M14.35 17.37c.13-.68.22-1.2 1.07-2.02.96-.92 1.7-1.6 2.06-1.82"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path
        d="M12.62 12.52c-.63-.5-2.22-1.64-3.5-2.26m7.98 3.79c.68-.55 2.46-1.75 3.74-2.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

export default George