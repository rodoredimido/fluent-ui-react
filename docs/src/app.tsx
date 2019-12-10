import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { themes, Debug, Provider } from '@fluentui/react'
import { FabricToTeamsProvider, TeamsToFabricProvider } from '@fluentui/react-base-theme'

import { mergeThemes } from 'src/lib'
import { ThemeContext, ThemeContextData, themeContextDefaults } from './context/ThemeContext'
import Routes from './routes'
import { PerfDataProvider } from './components/ComponentDoc/PerfChart'

// Experimental dev-time accessibility attributes integrity validation.
import { setup } from '@fluentui/ability-attributes'
import { Fabric } from 'office-ui-fabric-react'

// Temporarily disabling the validation for Screener.
if (process.env.NODE_ENV !== 'production' && !process.env.SCREENER) {
  setup()
}

class App extends React.Component<any, ThemeContextData> {
  // State also contains the updater function so it will
  // be passed down into the context provider
  state: ThemeContextData = {
    ...themeContextDefaults,
    changeTheme: (e, { value: item }) => this.setState({ selectedTheme: item }),
  }

  render() {
    const { selectedTheme } = this.state
    return (
      <ThemeContext.Provider value={this.state}>
        {selectedTheme.value === 'fabricToTeams' ? (
          <Fabric applyTheme>
            <FabricToTeamsProvider fluentOverridesTheme={themes['teams']}>
              <PerfDataProvider>
                <div>
                  <Debug />
                  <Routes />
                </div>
              </PerfDataProvider>
            </FabricToTeamsProvider>
          </Fabric>
        ) : selectedTheme.value === 'teamsToFabric' ? (
          <Provider theme={themes['teams']}>
            <TeamsToFabricProvider>
              <PerfDataProvider>
                <div>
                  <Debug />
                  <Routes />
                </div>
              </PerfDataProvider>
            </TeamsToFabricProvider>
          </Provider>
        ) : (
          <Provider
            theme={mergeThemes(themes.fontAwesome, themes[selectedTheme.value], {
              staticStyles: [
                {
                  a: {
                    textDecoration: 'none',
                  },
                },
              ],
            })}
          >
            <PerfDataProvider>
              <div>
                <Debug />
                <Routes />
              </div>
            </PerfDataProvider>
          </Provider>
        )}
      </ThemeContext.Provider>
    )
  }
}

export default hot(App)
