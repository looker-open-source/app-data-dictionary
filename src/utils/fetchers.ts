/*

 MIT License

 Copyright (c) 2022 Looker Data Sciences, Inc.

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
import React, { useState, useEffect, useContext } from 'react'
import type { ExtensionContextData40 } from '@looker/extension-sdk-react'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import type {
  ILooker40SDK,
  ILookmlModel,
  ILookmlModelExplore,
  IUser,
} from '@looker/sdk'
import type {
  FieldComments,
  CommentPermissions,
} from '../../src/components/interfaces'

const globalCache: any = {}

export function getCached<T>(key: string): T {
  return globalCache[key]
}

export async function loadCached<T>(
  key: string,
  callback: () => Promise<T>
): Promise<T> {
  if (globalCache[key]) {
    return getCached(key)
  } else {
    const val = await callback()
    /* eslint-disable require-atomic-updates */
    globalCache[key] = val
    return val
  }
}

export const loadCachedExplore = async (
  sdk: ILooker40SDK,
  modelName: string,
  exploreName: string
) => {
  return loadCached(`${modelName}|${exploreName}`, () =>
    sdk.ok(sdk.lookml_model_explore(modelName, exploreName))
  )
}

export const loadUsers = async (coreSDK: ILooker40SDK, ids: string[]) => {
  if (ids && ids.length > 0) {
    return coreSDK.ok(
      // TODO extensionSDK cannot handle serialization of DelimArray
      coreSDK.all_users({ ids: ids.join(',') as any })
    )
  }
  return []
}

export const loadAllModels = async (sdk: ILooker40SDK) => {
  return loadCached('all_lookml_models', () =>
    sdk.ok(sdk.all_lookml_models({}))
  )
}

export const getMyUser = async (sdk: ILooker40SDK) => {
  return sdk.ok(sdk.me())
}

export const getGroups = async (sdk: ILooker40SDK) => {
  const disabled = await sdk.ok(
    sdk.search_groups({ name: 'marketplace_data_dictionary_comments_disabled' })
  )
  const reader = await sdk.ok(
    sdk.search_groups({ name: 'marketplace_data_dictionary_comments_reader' })
  )
  const writer = await sdk.ok(
    sdk.search_groups({ name: 'marketplace_data_dictionary_comments_writer' })
  )
  const manager = await sdk.ok(
    sdk.search_groups({ name: 'marketplace_data_dictionary_comments_manager' })
  )
  return {
    disabled: disabled[0],
    reader: reader[0],
    writer: writer[0],
    manager: manager[0],
  }
}

export function useAllModels() {
  const { coreSDK } = useContext(ExtensionContext40)
  const [allModels, setAllModels] = useState<ILookmlModel[] | undefined>(
    undefined
  )
  useEffect(() => {
    async function fetcher() {
      setAllModels(await loadAllModels(coreSDK))
    }
    fetcher()
  }, [coreSDK])
  return allModels
}

export function useExplore(modelName?: string, exploreName?: string) {
  const { coreSDK } = useContext(ExtensionContext40)
  const [currentExplore, setCurrentExplore] = useState<
    ILookmlModelExplore | undefined
  >(undefined)
  const [loadingExplore, setLoadingExplore] = useState<string | null>(null)
  useEffect(() => {
    async function fetcher() {
      if (modelName && exploreName) {
        setLoadingExplore(exploreName)
        setCurrentExplore(
          await loadCachedExplore(coreSDK, modelName, exploreName)
        )
        setLoadingExplore(null)
      } else {
        setCurrentExplore(undefined)
      }
    }
    fetcher()
  }, [coreSDK, modelName, exploreName])
  return { loadingExplore, currentExplore }
}

export const loadModel = async (sdk: ILooker40SDK, modelName: string) => {
  return (await loadAllModels(sdk)).find((m) => m.name === modelName)
}

export async function loadModelDetail(
  sdk: ILooker40SDK,
  modelName: string
): Promise<DetailedModel | undefined> {
  const model = await loadModel(sdk, modelName)
  let explores: ILookmlModelExplore[] = []
  if (model && model.explores) {
    explores = await Promise.all(
      model.explores.map((explore) => {
        return loadCachedExplore(sdk, model.name || '', explore.name || '')
      })
    )
    return {
      model,
      explores,
    }
  }
  return undefined
}

export function useModelDetail(modelName?: string) {
  const { coreSDK } = useContext(ExtensionContext40)
  const [modelDetail, setModelDetail] = useState<DetailedModel | undefined>(
    undefined
  )
  useEffect(() => {
    async function fetcher() {
      if (modelName) {
        setModelDetail(await loadModelDetail(coreSDK, modelName))
      }
    }
    fetcher()
  }, [coreSDK, modelName])
  return modelDetail
}

export function getAuthorIds(commentString: string) {
  const comments = JSON.parse(commentString)
  const authorIds: string[] = []

  const commentExplores = Object.keys(comments)
  commentExplores.forEach((i) => {
    const commentExploreFields = Object.keys(comments[i])
    commentExploreFields.forEach((j) => {
      comments[i][j].forEach((c: FieldComments) => {
        if (!authorIds.includes(c.author.toString())) {
          authorIds.push(c.author.toString())
        }
      })
    })
  })
  return authorIds
}

export const determinePermissions = (me: IUser, groups: any) => {
  // Order indicates write order. In this implementation, highest
  // permission level wins if duplicates exist.
  let perms = { reader: false, writer: true, manager: false, disabled: false }
  if (groups.reader && me.group_ids?.includes(groups.reader.id)) {
    perms = { reader: true, writer: false, manager: false, disabled: false }
  }
  if (groups.writer && me.group_ids?.includes(groups.writer.id)) {
    perms = { writer: true, reader: false, manager: false, disabled: false }
  }
  if (groups.manager && me.group_ids?.includes(groups.manager.id)) {
    perms = { manager: true, writer: false, reader: false, disabled: false }
  }
  // Checks "disabled" last
  if (groups.disabled && me.group_ids?.includes(groups.disabled.id)) {
    perms = { ...perms, disabled: true }
  }
  return perms
}

export interface DetailedModel {
  model: ILookmlModel
  explores: ILookmlModelExplore[]
}

export function useComments(currentExplore?: ILookmlModelExplore) {
  const { extensionSDK, coreSDK } = useContext<ExtensionContextData40>(
    ExtensionContext40
  )
  const [permissions, setPermissions] = useState<CommentPermissions>({
    disabled: false,
    reader: false,
    writer: true,
    manager: false,
  })
  const [authors, setAuthors] = React.useState<IUser[]>([])
  const [comments, setComments] = React.useState('{}')
  const [me, setMe] = React.useState<IUser>()

  const addComment = async (
    newCommentStr: string,
    field: string
  ): Promise<void> => {
    const revivedComments = JSON.parse(comments)
    const newComment = JSON.parse(newCommentStr)
    if (currentExplore && currentExplore.name) {
      // TODO Figure out what this is supposed to be doing
      // eslint-disable-next-line no-unused-expressions
      revivedComments[currentExplore.name]
        ? null
        : (revivedComments[currentExplore.name] = {})
      if (revivedComments[currentExplore.name][field]) {
        const revivedFields = revivedComments[currentExplore.name][field]
        revivedFields.push(newComment)
        revivedComments[currentExplore.name][field] = revivedFields
      } else {
        revivedComments[currentExplore.name][field] = [newComment]
      }
    }
    if (permissions.writer || permissions.manager) {
      try {
        setComments(JSON.stringify(revivedComments))
        await extensionSDK.saveContextData(JSON.stringify(revivedComments))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const editComment = async (
    modCommentStr: string,
    field: string
  ): Promise<void> => {
    const revivedComments = JSON.parse(comments)
    const modComment = JSON.parse(modCommentStr)

    if (currentExplore && currentExplore.name) {
      const newFieldComments = revivedComments[currentExplore.name][
        field
      ].filter((d: FieldComments) => {
        return d.pk !== modComment.pk
      })
      newFieldComments.push(modComment)
      revivedComments[currentExplore.name][field] = newFieldComments
    }

    if (permissions.writer || permissions.manager) {
      try {
        setComments(JSON.stringify(revivedComments))
        await extensionSDK.saveContextData(JSON.stringify(revivedComments))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const deleteComment = async (
    delCommentStr: string,
    field: string
  ): Promise<void> => {
    const revivedComments = JSON.parse(comments)
    const delComment = JSON.parse(delCommentStr)

    if (currentExplore && currentExplore.name) {
      const newFieldComments = revivedComments[currentExplore.name][
        field
      ].filter((d: any) => {
        return d.pk !== delComment.pk
      })
      revivedComments[currentExplore.name][field] = newFieldComments
    }

    if (permissions.writer || permissions.manager) {
      try {
        setComments(JSON.stringify(revivedComments))
        await extensionSDK.saveContextData(JSON.stringify(revivedComments))
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    const initialize = async () => {
      // Context requires Looker version 7.14.0. If not supported provide
      // default configuration object and disable saving of context data.
      let context
      try {
        context = await extensionSDK.getContextData()
        const authorIds = getAuthorIds(context || '{}')
        const contextObj = JSON.parse(context || '{}')
        if (currentExplore && currentExplore.name) {
          if (!contextObj[currentExplore.name]) {
            contextObj[currentExplore.name] = {}
          }
        }
        setComments(JSON.stringify(contextObj))
        setAuthors(await loadUsers(coreSDK, authorIds))
        setMe(await getMyUser(coreSDK))
        const groups = await getGroups(coreSDK)
        me && groups && setPermissions(determinePermissions(me, groups))
      } catch (error) {
        console.error(error)
      }
    }
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExplore])

  return {
    comments,
    authors,
    me,
    permissions,
    addComment,
    editComment,
    deleteComment,
  }
}
