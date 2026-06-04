// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import {
  ButtonOutline,
  Button,
  Flex,
  FlexItem,
  FieldTextArea,
  Space,
  Text,
} from '@looker/components'

import type {
  IUser,
  ILookmlModelExploreField,
  ILookmlModelExplore,
} from '@looker/sdk'
import { NOT_EDITING_COMMENT } from '../utils/constants'
import type { UserData, FieldComments, CommentPermissions } from './interfaces'
import { FieldComment } from './FieldComment'

export const FieldCommentList: React.FC<{
  sortedComments: FieldComments[]
  addComment: (newCommentStr: string, field: string) => void
  editComment: (newCommentStr: string, field: string) => void
  deleteComment: (newCommentStr: string, field: string) => void
  explore: ILookmlModelExplore
  field: ILookmlModelExploreField
  commentAuthors: IUser[]
  me: IUser
  permissions: CommentPermissions
}> = ({
  sortedComments,
  addComment,
  editComment,
  deleteComment,
  field,
  commentAuthors,
  me,
  permissions,
}) => {
  const [addingNew, setAddingNew] = React.useState(false)
  const [editingComment, setEditingComment] = React.useState('')
  const [commentContent, setCommentContent] = React.useState('')

  const toggleNew = () => {
    setAddingNew(!addingNew)
  }
  const handleChange = (e: any) => {
    setCommentContent(encodeURI(e.target.value))
  }
  const addToComments = () => {
    const generated_timestamp = Date.now()
    const comment = {
      author: me.id,
      timestamp: generated_timestamp,
      edited: false,
      content: commentContent,
      pk: `${generated_timestamp}::${me.id}`,
    }
    addComment(JSON.stringify(comment), field.name)
    setAddingNew(false)
  }
  const getCommentAuthorData = (author_id: string | number) => {
    const commentAuthor =
      commentAuthors &&
      commentAuthors.filter((d) => {
        return d.id === author_id.toString()
      })
    let authorData: UserData
    if (me.id === author_id) {
      authorData = {
        first_name: me.first_name || '',
        last_name: me.last_name || '',
        display_name: me.display_name || '',
        avatar_url: me.avatar_url || '',
      }
    } else if (commentAuthor.length === 0) {
      authorData = {
        first_name: 'Deleted',
        last_name: 'User',
        display_name: 'Deleted User',
        avatar_url: '',
      }
    } else {
      authorData = {
        avatar_url: commentAuthor[0].avatar_url || '',
        first_name: commentAuthor[0].first_name || '',
        last_name: commentAuthor[0].last_name || '',
        display_name: commentAuthor[0].display_name || '',
      }
    }
    return authorData
  }

  return (
    <Flex flexDirection="column">
      {sortedComments.map((comment: FieldComments) => {
        return (
          <FlexItem pb="small" key={comment.pk}>
            <FieldComment
              comment={comment}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              setCommentContent={setCommentContent}
              editComment={editComment}
              deleteComment={deleteComment}
              commentContent={commentContent}
              field={field}
              authorData={getCommentAuthorData(comment.author)}
              me={me}
              addingNew={addingNew}
              permissions={permissions}
            />
          </FlexItem>
        )
      })}
      {
        // eslint-disable-next-line no-nested-ternary
        addingNew ? (
          <FlexItem pb="small">
            <FieldTextArea
              autoFocus
              onChange={handleChange}
              aria-label="NewCommentTextArea"
            />
            <Space pt="small" gap="xsmall" reverse>
              <Button size="medium" onClick={addToComments}>
                Comment
              </Button>
              <ButtonOutline size="medium" color="neutral" onClick={toggleNew}>
                Cancel
              </ButtonOutline>
            </Space>
          </FlexItem>
        ) : editingComment === NOT_EDITING_COMMENT && !permissions.reader ? (
          <Button fullWidth onClick={toggleNew}>
            Add Comment
          </Button>
        ) : null
      }
      <Text pt="small" fontSize="xsmall" variant="secondary">
        These comments are unique to fields in the Data Dictionary and are not
        saved to any LookML description.
      </Text>
    </Flex>
  )
}
