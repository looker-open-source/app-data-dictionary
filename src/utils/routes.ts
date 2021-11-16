import { useRouteMatch } from "react-router-dom"
import { ILookmlModelNavExplore } from "@looker/sdk"
import { useAllModels, useExplore } from "./fetchers"

export function internalExploreURL({
  model,
  explore,
  field,
  tab,
}: {
  model: string
  explore: string
  field?: string,
  tab?: string,
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
      path: "/models/:model",
      sensitive: true
    }) || undefined

  const match2 =
    useRouteMatch<{ model: string; explore: string }>({
      path: "/models/:model/explores/:explore",
      sensitive: true
    }) || undefined

  const match3 =
    useRouteMatch<{ model: string; explore: string; field: string; tab: string;}>({
      path: "/models/:model/explores/:explore/field/:field/pane/:tab",
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
      modelData.filter(m => m.explores && m.explores.some((e: ILookmlModelNavExplore) => !e.hidden))[0]
    )
  }
  return modelData && modelData.find(m => m.name === modelName)
}
