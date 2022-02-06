import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { DragStartEvent, DragEndEvent, DndContext, DragOverlay, closestCenter, KeyboardSensor, TouchSensor, useSensor, useSensors, DraggableSyntheticListeners, MouseSensor, } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { styled } from '@/styles/stitches.config'
import { defaultPseudo } from '@/styles/utilStyles'
import { Book } from '@/lib/logic/app/Board'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import BookActionsDropdown from '@/components/page/home/BookActionsDropdown'
import StarRatingPreview from '@/components/page/home/StarRatingPreview'
import Box from '@/components/modular/Box'
import Icon from '@/components/modular/Icon'
import Text from '@/components/modular/Text'
import Flex from '@/components/modular/Flex'
import Spacer from '@/components/modular/Spacer'
import PlusIcon from '@/components/icons/PlusIcon'

const BooksList = observer(() => {
  const { viewMode } = container.resolve(BoardsHandler)

  return (
    <Box>
      {viewMode === 'read' ? <ReadBooksList /> : <UnreadBooksList />}
    </Box>
  )
})

const ReadBooksList = observer(() => {
  const { selectedBoard } = container.resolve(BoardsHandler)
  const ids = selectedBoard.getSortedReadBookIds()
  const books = selectedBoard.readBooks

  if (!ids.length) return <NoBooksText />

  return (
    <ul>
      {ids.map((id) => (
        <BookListItem
          book={books[id]}
          showRating={true}
          key={id}
        />
      ))}
    </ul>
  )
})

const UnreadBooksList = observer(() => {
  const { selectedBoard } = container.resolve(BoardsHandler)
  const [activeId, setActiveId] = useState<string | null>(null)
  const ids = selectedBoard.unreadBooksOrder

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!ids.length) return <NoBooksText />

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      announcements={{
        onDragStart(id) {
          return `Picked up draggable item ${getBookTitle(id)}.`
        },
        onDragOver(id) {
          return `${getBookTitle(id)} is in position ${getBookPosition(id)} of ${ids.length}`
        },
        onDragEnd(id) {
          return `${getBookTitle(id)} was placed in position ${getBookPosition(id)} of ${ids.length}`
        },
        onDragCancel() {
          return 'Dragging was cancelled.'
        }
      }}
    >
      <SortableContext
        items={[...ids]}
        strategy={verticalListSortingStrategy}
      >
        <ul>
          {ids.map((id) => <SortableItem id={id} key={id} />)}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={{ duration: 0, easing: 'ease', dragSourceOpacity: 0 }}>
        {activeId
          ? <BookListItem book={selectedBoard.unreadBooks[activeId]} showRating={false} highlight={true} />
          : null}
      </DragOverlay>
    </DndContext>
  )

  function getBookTitle(id: string) {
    return selectedBoard.unreadBooks[id].title
  }

  function getBookPosition(id: string) {
    return ids.indexOf(id) + 1
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    setActiveId(active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over?.id && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id)
      const newIndex = ids.indexOf(over.id)
      const newOrder = arrayMove(ids, oldIndex, newIndex)
      selectedBoard.updateUnreadBooksOrder(newOrder)
    }
  }
})

const SortableItem = ({ id }: { id: string }) => {
  const { selectedBoard } = container.resolve(BoardsHandler)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <BookListItem
      book={selectedBoard.unreadBooks[id]}
      showRating={false}
      hide={isDragging}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    />
  )
}

const BookListItem = observer(({ book, showRating, hide, listeners, attributes, setNodeRef, highlight, style }: {
  book: Book,
  showRating: boolean,
  hide?: boolean,
  listeners?: DraggableSyntheticListeners,
  attributes?: any,
  setNodeRef?: (node: HTMLElement | null) => void,
  highlight?: boolean
  style?: { transform?: string, transition?: string },
}) => {
  return (
    <BookListItemWrapper
      ref={setNodeRef}
      css={{
        marginTop: showRating ? '2.25rem' : 0,
        opacity: hide ? 0 : 1,
        transform: style?.transform,
        transition: style?.transition,
        color: highlight ? '$bg' : '$primary',
        '&::after': {
          background: highlight ? '$primary' : 'none'
        }
      }}
    >
      <Flex as="span" direction="column" css={{ width: '100%' }}>
        {showRating && <Rating book={book} />}
        <BookInfoWrapper showDragCursor={highlight || !!listeners} {...listeners} {...attributes}>
          <BookInfo book={book} />
        </BookInfoWrapper>
      </Flex>
      <Spacer ml="auto" />
      <BookActionsDropdown book={book} />
    </BookListItemWrapper>
  )
})

const Rating = observer(({ book }: { book: Book }) => {
  const { rating } = book

  return (
    <Box
      as="span"
      role="img"
      aria-label={`${rating} star${rating === 1 ? '' : 's'}`}
      css={{ position: 'absolute', top: '-1.1rem', transform: 'translateX(2px)' }}
    >
      <StarRatingPreview value={rating ?? 0} />
    </Box>
  )
})

const BookInfo = observer(({ book }: { book: Book }) => {
  return (
    <>
      <Text>
        {book.title}
      </Text>
      <Text css={{ opacity: 0.5, mt: '$1' }}>
        <span className="hidden">by{' '}</span>{book.author}
      </Text>
    </>
  )
})

const NoBooksText = observer(() => {
  const { viewMode } = container.resolve(BoardsHandler)

  return (
    <Box css={{ opacity: 0.8, lineHeight: 1.5 }}>
      <Text>
        You haven't {viewMode === 'read' ? 'finished any books on this board ' : 'added any books'} yet!
      </Text>
      {viewMode === 'unread' && (
        <Text>
          Press
          <Icon label="The add book button" icon={PlusIcon} css={{ mx: '$2', fontSize: '0.8em' }} />
          above to add one.
        </Text>
      )}
    </Box>
  )
})

const BookListItemWrapper = styled('li', {
  display: 'flex',
  position: 'relative',
  paddingLeft: '$4',
  '&:not(:last-of-type)': {
    marginBottom: '$4'
  },
  '&::before': {
    ...defaultPseudo,
    top: '0.42em',
    width: '4px',
    height: '4px',
    background: 'currentColor',
    borderRadius: '50%',
    opacity: 0.5
  },
  '&::after': {
    ...defaultPseudo,
    borderRadius: '8px',
    inset: '-5px -10px',
    zIndex: -1
  }
})

const BookInfoWrapper = styled('div', {
  touchAction: 'manipulation',
  wordBreak: 'break-word',
  variants: {
    showDragCursor: {
      true: {
        cursor: 'n-resize'
      }
    }
  }
})

export default BooksList