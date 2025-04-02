import { interfaceType } from "nexus"

export const Node = interfaceType({
    name: 'Node',
    resolveType(data) {
        if ('url' in data) {
            return 'Link'
        } else {
            return null
        }
    },
    definition(t) {
      t.nonNull.id('id', { 
        description: 'Unique identifier for the resource' 
      })
    },
  })
  