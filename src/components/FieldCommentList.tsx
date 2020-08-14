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
  ButtonOutline,
  Button,
  Flex,
  FlexItem,
  FieldTextArea,
  Space,
} from "@looker/components";
import styled from "styled-components";

import { IUser } from "@looker/sdk";
import { ExploreComments, UserData } from "./interfaces";
import { FieldComment } from "./FieldComment";

export const FieldCommentList: React.FC<{
  allComments: ExploreComments,
  setComments: (i: string) => void,
  fieldName: string,
  commentAuthors: IUser[],
  me: IUser,
}> = ({ allComments, 
        setComments, 
        fieldName, 
        commentAuthors,
        me }) => {
    const [addingNew, setAddingNew] = React.useState(false)
    const [editingComment, setEditingComment] = React.useState(0)
    const [commentContent, setCommentContent] = React.useState("")
    const toggleNew = () => {
        setAddingNew(!addingNew)
    }
    const handleChange = (e: any) => {
        setCommentContent(e.target.value)
    }
    const addComment = () => {
        let generated_timestamp = Date.now()
        let comment = {
            author: me.id,
            edited: false,
            timestamp: generated_timestamp,
            content: commentContent,
            pk: `${generated_timestamp}::${me.id}`,
        }

        let commentObj: ExploreComments = {};
        Object.assign(commentObj, allComments)
        if (allComments[fieldName]) {
            commentObj[fieldName].push(comment)
        } else {
            commentObj[fieldName] = [comment]
        }

        setComments(JSON.stringify(commentObj));
        toggleNew();
    }

    const getCommentAuthorData = (author_id: number) => {
        let commentAuthor = commentAuthors && commentAuthors.filter(d => {
            return d.id === author_id;
        })
        let authorData: UserData;
        if (me.id === author_id) {
            authorData = {
                first_name: me.first_name,
                last_name: me.last_name,
                display_name: me.display_name,
                avatar_url: me.avatar_url,
            }
        } else if (commentAuthor.length === 0) {
            authorData = {
                first_name: "Deleted",
                last_name: "User",
                display_name: "Deleted User",
                avatar_url: "",
            }
        } else {
            authorData = {
                avatar_url: commentAuthor[0].avatar_url,
                first_name: commentAuthor[0].first_name,
                last_name: commentAuthor[0].last_name,
                display_name: commentAuthor[0].display_name
            }
        }
        return authorData;
    }
    return (
        <Flex flexDirection="column">
            { allComments[fieldName] && allComments[fieldName].sort((x,y) => { return x.timestamp - y.timestamp }).map(comment => {
                return (
                    <FlexItem pb="small">
                        <FieldComment
                            comment={comment}
                            editingComment={editingComment}
                            setEditingComment={setEditingComment}
                            setCommentContent={setCommentContent}
                            allComments={allComments}
                            setComments={setComments}
                            commentContent={commentContent}
                            fieldName={fieldName}
                            authorData={getCommentAuthorData(comment.author)}
                            me={me}
                            addingNew={addingNew}
                        />
                    </FlexItem>
                )
            })}
            {/* Could add something like editingComment === 0 &&  to "disable" adding new comment while editing */}
            { addingNew ?
                <FlexItem pb="small">
                    <FieldTextArea autoFocus onChange={handleChange} />
                    <Space pt="small" gap="xsmall" reverse>
                        <Button size="medium" onClick={addComment}>Comment</Button>
                        <ButtonOutline size="medium" color="neutral" onClick={toggleNew}>Cancel</ButtonOutline>
                    </Space>
                </FlexItem> :
                editingComment === 0 ? <Button fullWidth onClick={toggleNew}>Add Comment</Button> : null
            }
        </Flex>
    );
};
