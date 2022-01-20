import { container } from 'tsyringe'
import { useMemo, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import { BookActionDialogProps } from '@/components/page/home/BookActionsDropdown'
import StarRatingInput from '@/components/page/home/StarRatingInput'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Dialog from '@/components/modular/Dialog'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'

const ReviewBookDialog = ({ selectedBook, isOpen, onOpenChange }: BookActionDialogProps) => {
  const isUpdatingReview = useMemo(() => !!selectedBook.rating, [selectedBook])
  const [rating, setRating] = useState(selectedBook.rating ?? 0)
  const [review, setReview] = useState(selectedBook.review ?? '')

  function handleMarkAsRead() {
    selectedBook.updateRating(rating)
    selectedBook.updateReview(review)
    if (!isUpdatingReview) {
      container.resolve(BoardsHandler).selectedBoard.markBookAsRead(selectedBook)
    }

    onOpenChange(false)
  }

  return (
    <Dialog
      title={isUpdatingReview ? 'Your thoughts' : 'Add thoughts'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <StarRatingInput
        value={rating}
        onChange={(value) => setRating(value)}
      />
      <Spacer mb="$4" />
      <label>
        Review
        <ReviewTextarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </label>
      <Spacer mb="$3" />
      <SimpleButton
        onClick={handleMarkAsRead}
        disabled={rating === 0}
      >
        {rating === 0
          ? 'Add a rating first'
          : isUpdatingReview ? 'Save' : 'Mark as read'}
      </SimpleButton>
    </Dialog>
  )
}

const ReviewTextarea = styled('textarea', {
  width: '100%',
  height: '15rem',
  marginTop: '$2',
  padding: '$2',
  border: 'solid 3px $primary',
  borderRadius: '8px',
  background: 'none',
  fontFamily: 'inherit',
  fontSize: '$body',
  color: 'inherit',
  resize: 'vertical',
  '&:focus': {
    boxShadow: 'none'
  }
})

export default ReviewBookDialog