import React, { useState, useEffect, useContext } from "react"
import { ExtensionContext, ExtensionContextData } from "@looker/extension-sdk-react"
import { Looker31SDK as LookerSDK, Looker31SDK } from '@looker/sdk/lib/sdk/3.1/methods'
import { ILookmlModel, ILookmlModelExplore, IUser } from "@looker/sdk/lib/sdk/4.0/models"
import { DelimArray } from "@looker/sdk/lib/rtl/delimArray"
import { ExploreComments, AllComments, FieldComments } from "../../src/components/interfaces";

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
  coreSDK: LookerSDK,
  ids: number[],
) => {
  // keeping this if needed in future
  let typed_ids: DelimArray<number> = new DelimArray<number>(
    ids
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return coreSDK.ok(coreSDK.all_users({ids: ids.toString() }))
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

export function getAuthorIds(commentString: string) {
  let comments = JSON.parse(commentString)
  let authorIds: number[] = [];

  let commentExplores = Object.keys(comments);
  commentExplores.forEach(i => {
    let commentExploreFields = Object.keys(comments[i]);
    commentExploreFields.forEach(j => {
      comments[i][j].forEach((c: FieldComments) => {
        if (!authorIds.includes(c.author)) {
          authorIds.push(c.author)
        }
      })
    })
  })
  return authorIds
}

export interface DetailedModel {
  model: ILookmlModel
  explores: ILookmlModelExplore[]
}