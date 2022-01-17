const ShelfPlant = ({ flip }: { flip?: boolean }) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 29"
      width="2.35rem"
      style={{ marginBottom: '-2.75px', transform: flip ? 'scaleX(-1)' : undefined, minWidth: '2.35rem' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m12.45.7-1.31 1.75a8.56 8.56 0 0 0-1.68 6.42 9.1 9.1 0 0 0-7.4-1.72l-2.02.4 2.6 3.47a8.2 8.2 0 0 0 3.1 2.5H2.89v5.09h1.74l2.1 10.09H18.6l1.77-10.09h1.5v-5.09h-2.32a9.78 9.78 0 0 0 3.1-2.76l2.4-3.32-2.49-.3c-2.6-.32-5.2.45-7.2 2a7.9 7.9 0 0 0-1.17-5.82L12.45.7Zm2.05 12.4A7.89 7.89 0 0 1 21.47 9l-.47.65a7.93 7.93 0 0 1-4.71 3.07l-1.8.39Zm-4.22-.25-.98-1.33a6.66 6.66 0 0 0-5.76-2.6l.72.96a6.36 6.36 0 0 0 3.51 2.32l2.5.65Zm2.26-1.23-.69-1.6c-.79-1.84-.6-4 .52-5.85l.12.19a6.1 6.1 0 0 1 .7 5.2l-.65 2.06Zm5.79 6.99-1.43 8.15H8.36l-1.7-8.15h11.67ZM4.88 16.67v-1.21h14.99v1.21h-15Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ShelfPlant