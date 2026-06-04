// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import type { SyntheticEvent } from 'react'
import React from 'react'
import {
  ButtonOutline,
  Button,
  FlexItem,
  FieldTextArea,
  useConfirm,
  Space,
} from '@looker/components'

import type { IUser, ILookmlModelExploreField } from '@looker/sdk'
import { NOT_EDITING_COMMENT } from '../utils/constants'
import type { FieldComments, UserData, CommentPermissions } from './interfaces'
import { FieldCommentDisplay } from './FieldCommentDisplay'

export const FieldComment: React.FC<{
  comment: FieldComments
  editingComment: string
  setEditingComment: (editingCommentPk: string) => void
  commentContent: string
  setCommentContent: (newCommentContent: string) => void
  editComment: (newCommentStr: string, field: string) => void
  deleteComment: (newCommentStr: string, field: string) => void
  field: ILookmlModelExploreField
  authorData: UserData
  me: IUser
  addingNew: boolean
  permissions: CommentPermissions
}> = ({
  comment,
  editingComment,
  setEditingComment,
  setCommentContent,
  editComment,
  deleteComment,
  field,
  commentContent,
  authorData,
  me,
  addingNew,
  permissions,
}) => {
  const showDetails = () => {
    if (permissions.manager || (comment.author === me.id && !addingNew)) {
      return 'show'
    }
    return 'hide'
  }

  const toggleEdit = () => {
    editingComment === NOT_EDITING_COMMENT
      ? setEditingComment(comment.pk)
      : setEditingComment(NOT_EDITING_COMMENT)
  }

  const endEdit = () => {
    setEditingComment(NOT_EDITING_COMMENT)
  }

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement
    setCommentContent(encodeURI(target.value))
  }

  const addToComments = () => {
    const newComment = {
      author: comment.author,
      edited: true,
      timestamp: comment.timestamp,
      content: commentContent,
      pk: comment.pk,
    }
    editComment(JSON.stringify(newComment), field.name)
    toggleEdit()
  }

  function deleteFromComments(close: any) {
    comment.deleted = true
    deleteComment(JSON.stringify(comment), field.name)
    close()
  }

  const [confirmationDialog, openDialog] = useConfirm({
    confirmLabel: 'Delete',
    buttonColor: 'critical',
    title: `Delete Comment?`,
    message:
      'Deleting this comment will permanently remove it. You cannot undo this later.',
    onConfirm: deleteFromComments,
  })

  return (
    <FlexItem>
      {confirmationDialog}
      {editingComment && comment.pk === editingComment ? (
        <FlexItem>
          <FieldTextArea
            autoFocus
            onChange={handleChange}
            defaultValue={decodeURI(comment.content)}
          />
          <Space pt="small" gap="xsmall" reverse>
            <Button size="medium" onClick={addToComments}>
              Save
            </Button>
            <ButtonOutline size="medium" color="neutral" onClick={endEdit}>
              Cancel
            </ButtonOutline>
          </Space>
        </FlexItem>
      ) : (
        <FieldCommentDisplay
          authorData={authorData}
          comment={comment}
          showDetails={showDetails}
          toggleEdit={toggleEdit}
          openDialog={openDialog}
        />
      )}
    </FlexItem>
  )
}
