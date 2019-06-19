import felaRenderer from './felaRenderer'
import { ProviderContextPrepared, ProviderContextInput } from '../types'
import mergeThemes from './mergeThemes'

export const mergeBooleanValues = (target, ...sources) => {
  return sources.reduce((acc, next) => {
    return typeof next === 'boolean' ? next : acc
  }, target)
}

const mergeProviderContexts = (...contexts: ProviderContextInput[]): ProviderContextPrepared => {
  const emptyContext = {
    theme: {
      siteVariables: {},
      componentVariables: {},
      componentStyles: {},
      fontFaces: [],
      staticStyles: [],
      icons: {},
      animations: {},
    },
    renderer: felaRenderer,
    rtl: false,
    disableAnimations: false,
  } as ProviderContextPrepared

  return contexts.reduce<ProviderContextPrepared>(
    (acc: ProviderContextPrepared, next: ProviderContextInput) => {
      if (!next) return acc

      acc.theme = mergeThemes(acc.theme, next.theme)

      // Latest RTL value wins
      const mergedRTL = mergeBooleanValues(acc.rtl, next.rtl)
      if (typeof mergedRTL === 'boolean') {
        acc.rtl = mergedRTL
      }

      // Use provided renderer if it is defined
      acc.renderer = next.renderer || acc.renderer

      // Latest disableAnimations value wins
      const mergedDisableAnimations = mergeBooleanValues(
        acc.disableAnimations,
        next.disableAnimations,
      )
      if (typeof mergedDisableAnimations === 'boolean') {
        acc.disableAnimations = mergedDisableAnimations
      }
      return acc
    },
    emptyContext,
  )
}

export default mergeProviderContexts
