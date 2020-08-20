/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React from "react";
import {
  theme,
  AvatarUser,
  ButtonOutline,
  Button,
  Card,
  CardContent,
  Flex,
  FlexItem,
  Heading,
  SpaceVertical,
  Icon,
  FieldTextArea,
  Menu,
  MenuDisclosure,
  MenuList,
  MenuItem,
  IconButton,
  useConfirm,
  Text,
  Space,
} from "@looker/components";
import styled from "styled-components";

import {IUser, ILookmlModelExploreField} from "@looker/sdk";
import { FieldComments, UserData } from "./interfaces";

const ReactMarkdown = require('react-markdown')

const CustomCommentCard = styled(Card)`
  .show {
    visibility: hidden;
  }

  .hide {
    visibility: hidden;
  }

  &:hover .show{
    visibility: visible;
  }
`;

export const NOT_EDITING_COMMENT = ""

export const FieldComment: React.FC<{
  comment: FieldComments,
  editingComment: string,
  setEditingComment: (i: string) => void,
  commentContent: string,
  setCommentContent: (i: string) => void,
  editComment: (i: string, j: string) => void,
  deleteComment: (i: string, j: string) => void,
  field: ILookmlModelExploreField,
  authorData: UserData,
  me: IUser,
  addingNew: boolean,
}> = ({ comment, 
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
    }) => {
    const showDetails = () => {
        if (comment.author === me.id && !addingNew) {
            return "show";
        }
        return "hide";
    }
    const toggleEdit = () => {
        editingComment === NOT_EDITING_COMMENT ? setEditingComment(comment.pk) : setEditingComment(NOT_EDITING_COMMENT)
    }
    const endEdit = () => {
        setEditingComment(NOT_EDITING_COMMENT)
    }
    const handleChange = (e: any) => {
        setCommentContent(e.target.value)
    }
    const addToComments = () => {
        let newComment = {
            author: comment.author,
            edited: true,
            timestamp: comment.timestamp,
            content: commentContent,
            pk: comment.pk,
        }
        editComment(JSON.stringify(newComment), field.name);
        toggleEdit();
    }
    function deleteCommentWrapper(close: any) {
        comment.deleted = true;
        deleteComment(JSON.stringify(comment), field.name);
        close();
    }
    
    const [confirmationDialog, openDialog] = useConfirm({
        confirmLabel: 'Delete',
        buttonColor: 'danger',
        title: `Delete Comment?`,
        message: 'Deleting this comment will permanently remove it. You cannot undo this later.',
        onConfirm: deleteCommentWrapper,
    })

    let timestamp = new Date(comment.timestamp);

    return (
        <FlexItem>
        { confirmationDialog }
        { editingComment && comment.pk === editingComment ?
        <FlexItem>
        <FieldTextArea autoFocus onChange={handleChange} defaultValue={comment.content}/>
        <Space pt="small" gap="xsmall" reverse>
            <Button size="medium" onClick={addToComments}>Save</Button>
            <ButtonOutline size="medium" color="neutral" onClick={endEdit}>Cancel</ButtonOutline>
        </Space>
        </FlexItem> :
        <CustomCommentCard>
            <CardContent>
            <FlexItem>
            <Flex pb="small">
                <FlexItem flexBasis="10%" pr="xsmall" pt="xxxsmall">
                    <AvatarUser user={authorData} size="xsmall"/>
                </FlexItem>
                <FlexItem flexBasis="80%">
                    <FlexItem>
                    <Text fontSize="small" fontWeight="semiBold">
                        {authorData.display_name}
                    </Text>
                    </FlexItem>
                    <FlexItem>
                    <Text fontSize="xsmall" variant="secondary">
                        { timestamp.toLocaleString() }
                        { comment.edited ? " (edited)" : null }
                    </Text>
                    </FlexItem>
                </FlexItem>
                <FlexItem flexBasis="10%">
                    <SpaceVertical align="end">
                        <Menu>
                        <MenuDisclosure>
                            <IconButton icon="DotsVert" label="More Options" className={showDetails()} />
                        </MenuDisclosure>
                        <MenuList>
                            <MenuItem onClick={toggleEdit}><Icon name="Edit" />Edit Comment</MenuItem>
                            <MenuItem onClick={openDialog}><Icon name="Trash" />Delete Comment</MenuItem>
                        </MenuList>
                        </Menu>
                    </SpaceVertical>
                </FlexItem>
            </Flex> 
            <Text fontSize="small">
                {comment.content}
            </Text>
            </FlexItem>
            </CardContent>
        </CustomCommentCard>
        }</FlexItem>
    );
};
