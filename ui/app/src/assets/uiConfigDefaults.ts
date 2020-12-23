/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses}.
 */

let count = 0;

const uiConfigDefaults = {
  preview: {
    toolsPanel: {
      widgets: [
        {
          id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
          uiKey: count++,
          configuration: {
            title: 'Dashboard',
            icon: {
              baseClass: 'fa fa-tasks'
            },
            widget: {
              id: 'craftercms.components.LegacyDashboardFrame',
              uiKey: count++
            }
          }
        },
        {
          id: 'craftercms.components.ToolsPanelPageButton',
          uiKey: count++,
          configuration: {
            title: 'Page Builder',
            icon: {
              baseClass: 'fa fa-paint-brush'
            },
            widgets: [
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewSearchPanel.title',
                    defaultMessage: 'Search'
                  },
                  icon: {
                    id: '@material-ui/icons/SearchRounded'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewSearchPanel',
                      uiKey: count++
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewComponentsPanel.title',
                    defaultMessage: 'Add Components'
                  },
                  icon: {
                    id: '@material-ui/icons/ExtensionOutlined'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewComponentsPanel',
                      uiKey: count++
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewBrowseComponentsPanel.title',
                    defaultMessage: 'Browse Components'
                  },
                  icon: {
                    id: '@material-ui/icons/ExtensionOutlined'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewBrowseComponentsPanel',
                      uiKey: count++
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewReceptaclesPanel.title',
                    defaultMessage: 'Component Receptacles'
                  },
                  icon: {
                    id: '@material-ui/icons/ExtensionOutlined'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewReceptaclesPanel',
                      uiKey: count++
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewAssetsPanel.title',
                    defaultMessage: 'Assets'
                  },
                  icon: {
                    id: '@material-ui/icons/ImageOutlined'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewAssetsPanel',
                      uiKey: count++
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewAudiencesPanel.title',
                    defaultMessage: 'Audience Targeting'
                  },
                  icon: {
                    id: '@material-ui/icons/EmojiPeopleRounded'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewAudiencesPanel',
                      uiKey: count++,
                      configuration: {
                        fields: {
                          segment: {
                            id: 'segment',
                            name: 'Segment',
                            description: 'User segment.',
                            type: 'dropdown',
                            defaultValue: 'anonymous',
                            values: [
                              {
                                label: 'Guy',
                                value: 'guy'
                              },
                              {
                                label: 'Gal',
                                value: 'gal'
                              },
                              {
                                label: 'Anonymous',
                                value: 'anonymous'
                              }
                            ],
                            helpText: 'Setting the segment will change content targeting to the audience selected.'
                          },
                          name: {
                            id: 'name',
                            name: 'Name',
                            description: "User's first and last name.",
                            type: 'input',
                            helpText: "Enter user's first and last name."
                          }
                        }
                      }
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewPageExplorerPanel.title',
                    defaultMessage: 'Page Explorer'
                  },
                  icon: {
                    id: 'craftercms.icons.PageExplorer'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewPageExplorerPanel',
                      uiKey: count++
                    }
                  ]
                }
              },
              {
                id: 'craftercms.components.ToolsPanelPageButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'previewSimulatorPanel.title',
                    defaultMessage: 'Device Simulator'
                  },
                  icon: {
                    id: '@material-ui/icons/DevicesRounded'
                  },
                  widgets: [
                    {
                      id: 'craftercms.components.PreviewSimulatorPanel',
                      uiKey: count++,
                      configuration: {
                        devices: [
                          {
                            title: 'smartPhone',
                            width: 375,
                            height: 667
                          },
                          {
                            title: 'tablet',
                            width: 768,
                            height: 1024
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          id: 'craftercms.components.ToolsPanelPageButton',
          uiKey: count++,
          configuration: {
            title: {
              id: 'previewSiteExplorerPanel.title',
              defaultMessage: 'Site Explorer'
            },
            icon: {
              id: 'craftercms.icons.SiteExplorer'
            },
            widgets: [
              {
                id: 'craftercms.components.PathNavigator',
                uiKey: count++,
                configuration: {
                  id: 'Pages',
                  label: 'Pages',
                  icon: {
                    baseClass: 'fa',
                    expandedClass: 'fa-file-text-o',
                    collapsedClass: 'fa-file-text'
                  },
                  rootPath: '/site/website',
                  locale: 'en'
                }
              },
              {
                id: 'craftercms.components.PathNavigator',
                uiKey: count++,
                configuration: {
                  id: 'Components',
                  label: 'Components',
                  icon: {
                    baseClass: 'fa fa-puzzle-piece'
                  },
                  rootPath: '/site/components',
                  locale: 'en'
                }
              },
              {
                id: 'craftercms.components.PathNavigator',
                uiKey: count++,
                configuration: {
                  id: 'Taxonomy',
                  label: 'Taxonomy',
                  icon: {
                    baseClass: 'fa fa-tags'
                  },
                  rootPath: '/site/taxonomy',
                  locale: 'en'
                }
              },
              {
                id: 'craftercms.components.PathNavigator',
                uiKey: count++,
                configuration: {
                  id: 'StaticAssets',
                  label: 'Static Assets',
                  icon: {
                    baseClass: 'fa fa-image'
                  },
                  rootPath: '/static-assets',
                  locale: 'en'
                }
              },
              {
                id: 'craftercms.components.PathNavigator',
                uiKey: count++,
                configuration: {
                  label: 'Templates',
                  icon: {
                    baseClass: 'fa fa-file-code-o'
                  },
                  rootPath: '/templates',
                  locale: 'en'
                }
              },
              {
                id: 'craftercms.components.PathNavigator',
                uiKey: count++,
                configuration: {
                  label: 'Scripts',
                  icon: {
                    baseClass: 'fa fa-code'
                  },
                  rootPath: '/scripts',
                  locale: 'en'
                }
              }
            ]
          }
        },
        {
          id: 'craftercms.components.ToolsPanelPageButton',
          uiKey: count++,
          roles: ['admin', 'developer'],
          configuration: {
            title: {
              id: 'siteTools.title',
              defaultMessage: 'Site Tools'
            },
            icon: {
              baseClass: 'fa fa-sliders'
            },
            widgets: [
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'contentTypes.title',
                    defaultMessage: 'Content Types'
                  },
                  icon: {
                    baseClass: 'fa fa-th-large'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'content-types'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'encryptionTool.title',
                    defaultMessage: 'Encryption Tool'
                  },
                  icon: {
                    baseClass: 'fa fa-lock'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'encrypt-tool'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'configuration.title',
                    defaultMessage: 'Configuration'
                  },
                  icon: {
                    baseClass: 'fa fa-cogs'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'admin-configurations'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'audit.title',
                    defaultMessage: 'Audit'
                  },
                  icon: {
                    baseClass: 'fa fa-align-justify'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'audit'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'workflowStates.title',
                    defaultMessage: 'Workflow States'
                  },
                  icon: {
                    baseClass: 'fa fa-cog'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'workflow-states'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'logConsole.title',
                    defaultMessage: 'Log Console'
                  },
                  icon: {
                    baseClass: 'fa fa-align-left'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'log-view'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'publishing.title',
                    defaultMessage: 'Publishing'
                  },
                  icon: {
                    baseClass: 'fa fa-cloud-upload'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'status-view'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'remoteRepositories.title',
                    defaultMessage: 'Remote Repositories'
                  },
                  icon: {
                    baseClass: 'fa fa-database'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'repository'
                    }
                  }
                }
              },
              {
                id: 'craftercms.components.ToolsPanelEmbeddedAppViewButton',
                uiKey: count++,
                configuration: {
                  title: {
                    id: 'graphql.title',
                    defaultMessage: 'GraphQL'
                  },
                  icon: {
                    baseClass: 'fa fa-line-chart'
                  },
                  widget: {
                    id: 'craftercms.components.LegacySiteToolsFrame',
                    uiKey: count++,
                    configuration: {
                      tool: 'graphiql'
                    }
                  }
                }
              }
            ]
          }
        },
        {
          id: 'craftercms.components.ToolsPanelPageButton',
          uiKey: count++,
          configuration: {
            title: {
              id: 'words.settings',
              defaultMessage: 'Settings'
            },
            icon: {
              id: '@material-ui/icons/Settings'
            },
            widgets: [
              {
                id: 'craftercms.components.PreviewSettingsPanel',
                uiKey: count++
              }
            ]
          }
        }
      ]
    }
  },
  globalNav: {
    sections: [
      {
        uiKey: count++,
        title: {
          id: 'words.site',
          defaultMessage: 'Site'
        },
        widgets: [
          {
            id: 'craftercms.components.GlobalNavLinkTile',
            uiKey: count++,
            configuration: {
              title: {
                id: 'words.dashboard',
                defaultMessage: 'Dashboard'
              },
              systemLinkId: 'siteDashboard',
              icon: { id: '@material-ui/icons/DashboardRounded' }
            }
          },
          {
            id: 'craftercms.components.GlobalNavLinkTile',
            uiKey: count++,
            configuration: {
              title: {
                id: 'words.preview',
                defaultMessage: 'Preview'
              },
              systemLinkId: 'preview',
              icon: { id: 'craftercms.icons.Preview' }
            }
          },
          {
            id: 'craftercms.components.GlobalNavLinkTile',
            uiKey: count++,
            configuration: {
              title: {
                id: 'siteTools.title',
                defaultMessage: 'Site Tools'
              },
              systemLinkId: 'siteTools',
              icon: { id: '@material-ui/icons/BuildRounded' }
            }
          },
          {
            id: 'craftercms.components.GlobalNavLinkTile',
            uiKey: count++,
            configuration: {
              title: {
                id: 'words.search',
                defaultMessage: 'Search'
              },
              systemLinkId: 'siteSearch',
              icon: { id: '@material-ui/icons/SearchRounded' }
            }
          }
        ]
      }
    ]
  }
};

export default uiConfigDefaults;
