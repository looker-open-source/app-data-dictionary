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

import {IUser} from "@looker/sdk";
import { FieldComments, ExploreComments, UserData } from "./interfaces";

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

export const FieldComment: React.FC<{
  comment: FieldComments,
  editingComment: Number,
  setEditingComment: (i: number) => void,
  commentContent: string,
  setCommentContent: (i: string) => void,
  allComments: ExploreComments,
  setComments: (i: string) => void,
  fieldName: string,
  authorData: UserData,
  me: IUser,
  addingNew: boolean,
}> = ({ comment, 
        editingComment, 
        setEditingComment, 
        setCommentContent, 
        allComments, 
        setComments, 
        fieldName, 
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
        editingComment === 0 ? setEditingComment(comment.timestamp) : setEditingComment(0)
    }
    const endEdit = () => {
        setEditingComment(0)
    }
    const handleChange = (e: any) => {
        setCommentContent(e.target.value)
    }
    const editComment = () => {
        let newComments = allComments[fieldName].filter(d => {
            return d.timestamp !== comment.timestamp;
        })
        newComments.push({
            author: me.id,
            edited: true,
            timestamp: comment.timestamp,
            content: commentContent,
            pk: comment.pk,
        })
        allComments[fieldName] = newComments
        setComments(JSON.stringify(allComments));
        toggleEdit();
    }
    function handleConfirm(close: any) {
        let newComments = allComments[fieldName].filter(d => {
            return d.timestamp !== comment.timestamp;
        })
        allComments[fieldName] = newComments
        setComments(JSON.stringify(allComments));
        close();
    }
    
    const [confirmationDialog, openDialog] = useConfirm({
        confirmLabel: 'Delete',
        buttonColor: 'danger',
        title: `Delete Comment?`,
        message: 'Deleting this comment will permanently remove it. You cannot undo this later.',
        onConfirm: handleConfirm,
    })

    let timestamp = new Date(comment.timestamp);

    return (
        <FlexItem>
        { confirmationDialog }
        { editingComment && comment.timestamp === editingComment ?
        <FlexItem>
        <FieldTextArea autoFocus onChange={handleChange} defaultValue={comment.content}/>
        <Space pt="small" gap="xsmall" reverse>
            <Button size="medium" onClick={editComment}>Save</Button>
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
                    <Heading as="h5" fontWeight="semiBold">
                        {authorData.display_name}
                    </Heading>
                    <Text fontSize="xxsmall" variant="secondary">
                        { timestamp.toLocaleString() }
                        { comment.edited ? " (edited)" : null }
                    </Text>
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
            <Text fontSize="xsmall">
                {comment.content}
            </Text>
            </FlexItem>
            </CardContent>
        </CustomCommentCard>
        }</FlexItem>
    );
};
