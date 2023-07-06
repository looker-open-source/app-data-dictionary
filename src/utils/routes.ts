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
import { useRouteMatch } from 'react-router-dom'
import type { ILookmlModelNavExplore } from '@looker/sdk'
import { useAllModels, useExplore } from './fetchers'

export function internalExploreURL({
  model,
  explore,
  field,
  tab,
}: {
  model: string
  explore: string
  field?: string
  tab?: string
}) {
  let url = `/models/${encodeURIComponent(model)}/explores/${encodeURIComponent(
    explore
  )}`
  if (field) {
    url = `${url}/field/${encodeURIComponent(field)}`
  }
  if (tab) {
    url = `${url}/pane/${encodeURIComponent(tab)}`
  }
  return url
}

export function internalModelURL({ model }: { model: string }) {
  return `/models/${encodeURIComponent(model)}`
}

export function usePathNames(): {
  modelName?: string
  exploreName?: string
  fieldName?: string
  detailPane?: string
} {
  const match =
    useRouteMatch<{ model: string }>({
      path: '/models/:model',
      sensitive: true,
    }) || undefined

  const match2 =
    useRouteMatch<{ model: string; explore: string }>({
      path: '/models/:model/explores/:explore',
      sensitive: true,
    }) || undefined

  const match3 =
    useRouteMatch<{
      model: string
      explore: string
      field: string
      tab: string
    }>({
      path: '/models/:model/explores/:explore/field/:field/pane/:tab',
    }) || undefined

  return {
    modelName: match && decodeURIComponent(match.params.model),
    exploreName: match2 && decodeURIComponent(match2.params.explore),
    fieldName: match3 && decodeURIComponent(match3.params.field),
    detailPane: match3 && match3.params.tab,
  }
}

export function useCurrentExplore() {
  const { modelName, exploreName } = usePathNames()
  return useExplore(modelName, exploreName)
}

export function useCurrentModel() {
  const { modelName } = usePathNames()
  const modelData = useAllModels()
  if (!modelName) {
    return (
      modelData &&
      modelData.filter(
        (m) =>
          m.explores &&
          m.explores.some((e: ILookmlModelNavExplore) => !e.hidden)
      )[0]
    )
  }
  return modelData && modelData.find((m) => m.name === modelName)
}
