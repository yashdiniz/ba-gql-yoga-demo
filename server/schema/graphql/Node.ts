import { interfaceType } from "nexus"

export const Node = interfaceType({
  name: 'Node',
  resolveType(data) {
      if ('votes' in data) {
        return 'Reply'
      } else if ('name' in data) {
        return 'User'
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
