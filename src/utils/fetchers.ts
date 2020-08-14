import React, { useState, useEffect, useContext } from "react"
import { ExtensionContext, ExtensionContextData } from "@looker/extension-sdk-react"
import { Looker31SDK as LookerSDK, Looker31SDK } from '@looker/sdk/lib/sdk/3.1/methods'
import { ILookmlModel, ILookmlModelExplore, IUser } from "@looker/sdk/lib/sdk/4.0/models"
import { DelimArray } from "@looker/sdk/lib/rtl/delimArray"
import { ExploreComments, AllComments, FieldComments } from "../../src/components/interfaces";
import * as semver from 'semver'

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
  sdk: LookerSDK,
  modelName: string,
  exploreName: string
) => {
  return loadCached(`${modelName}|${exploreName}`, () =>
    sdk.ok(sdk.lookml_model_explore(modelName, exploreName))
  )
}

export const loadUsers = async (
  sdk: LookerSDK,
  ids: number[],
) => {
  let typed_ids: DelimArray<number> = new DelimArray<number>(
    ids
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return sdk.ok(sdk.all_users({ids: ids.toString() }))
}

export const loadAllModels = async (sdk: LookerSDK) => {
  return loadCached("all_lookml_models", () => sdk.ok(sdk.all_lookml_models()))
}

export const getMyUser = async (sdk: LookerSDK) => {
  return sdk.ok(sdk.me())
}

export function useAllModels() {
  const { coreSDK } = useContext(ExtensionContext)
  const [allModels, allModelsSetter] = useState<ILookmlModel[] | undefined>(undefined)
  useEffect(() => {
    async function fetcher() {
      allModelsSetter(await loadAllModels(coreSDK))
    }
    fetcher()
  }, [coreSDK])
  return allModels
}

export function getMe() {
  const { coreSDK } = useContext(ExtensionContext)
  const [me, meSetter] = useState<IUser | undefined>(undefined)
  useEffect(() => {
    async function fetcher() {
      meSetter(await getMyUser(coreSDK))
    }
    fetcher()
  }, [coreSDK])
  return me
}

export function getAuthorData(ids: number[]) {
  const { coreSDK } = useContext(ExtensionContext)
  const [commentAuthors, commentAuthorSetter] = useState<IUser[] | undefined>(undefined)
  useEffect(() => {
    async function fetcher() {
      if (ids.length > 0) {
        commentAuthorSetter(await loadUsers(coreSDK, ids))
      } else {
        commentAuthorSetter(undefined)
      }
    }
    fetcher()
  }, [coreSDK, ids])
  return commentAuthors
}

export function useExplore(modelName?: string, exploreName?: string) {
  const { coreSDK } = useContext(ExtensionContext)
  const [currentExplore, exploreSetter] = useState<ILookmlModelExplore | undefined>(undefined)
  const [loadingExplore, loadingExploreSetter] = useState(null)
  useEffect(() => {
    async function fetcher() {
      if (modelName && exploreName) {
        loadingExploreSetter(exploreName)
        exploreSetter(await loadCachedExplore(coreSDK, modelName, exploreName))
        loadingExploreSetter(null)
      }
    }
    fetcher()
  }, [coreSDK, modelName, exploreName])
  return { loadingExplore, currentExplore }
}

export const loadModel = async (sdk: LookerSDK, modelName: string) => {
  return (await loadAllModels(sdk)).find(m => m.name === modelName)
}

export async function loadModelDetail(
  sdk: LookerSDK,
  modelName: string
): Promise<DetailedModel> {
  const model = await loadModel(sdk, modelName)
  const explores = await Promise.all(
    model.explores.map(explore => {
      return loadCachedExplore(sdk, model.name, explore.name)
    })
  )
  return {
    model,
    explores
  }
}

export function useModelDetail(modelName?: string) {
  const { coreSDK } = useContext(ExtensionContext)
  const [modelDetail, setModelDetail] = useState<DetailedModel | undefined>(undefined)
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

export function getExploreComments(currentExplore: ILookmlModelExplore, loadingExplore: string) {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK, initializeError } = extensionContext
  const [canPersistContextData, setCanPersistContextData] = useState<boolean>(
    false
  )
  const [exploreComments, setExploreComments] = React.useState("{}")
  const [contextCopy, setContextCopy] = React.useState("{}")
  
  useEffect(() => {
    const initialize = async () => {
      // Context requires Looker version 7.14.0. If not supported provide
      // default configuration object and disable saving of context data.
      let context
      if (
        semver.intersects(
          '>=7.14.0',
          extensionSDK.lookerHostData?.lookerVersion || '7.0.0',
          true
        )
      ) {
        try {
          context = await extensionSDK.getContextData()
          setCanPersistContextData(true)
          setContextCopy(context)
        } catch (error) {
          console.error(error)
        }
      }
    }
    initialize()
  }, [])
  let contextObj = JSON.parse(contextCopy)
  let exploreRef = currentExplore ? currentExplore.name : loadingExplore
  let exploreContent = contextObj[exploreRef] ? JSON.stringify(contextObj[exploreRef]) : "{}"
  exploreContent !== exploreComments ? setExploreComments(exploreContent) : null

  const updateComments = async (newExploreComments: string): Promise<boolean> => {
    console.log(newExploreComments)
    let comments = JSON.parse(contextCopy)
    comments[currentExplore.name] = JSON.parse(newExploreComments)
    if (canPersistContextData) {
      try {
        setContextCopy(JSON.stringify(comments))
        await extensionSDK.saveContextData(JSON.stringify(comments))
        return true
      } catch (error) {
        console.log(error)
      }
    }
    return false
  }

  return { exploreComments, updateComments }
}

export function getAuthorIds(comments: ExploreComments) {
  let authorIds: number[] = [];
  let commentFields = Object.keys(comments);
  commentFields.forEach(i => {
    comments[i].forEach(j => {
      if (!authorIds.includes(j.author)) {
        authorIds.push(j.author)
      }
    })
  })
  return { authorIds }
}

export interface DetailedModel {
  model: ILookmlModel
  explores: ILookmlModelExplore[]
}