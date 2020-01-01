const typeDefs = `
    type Chat {
      id: Int!
      from: String!
      To: String!
      message: String!
    }

    type User {
      id: Int!
      name: String!
      email: String!
    }

    type Query {
      chats(from: String, To: String): [Chat]
      getAllUser(name: String!): [User]
    }

    type Mutation {
      sendMessage(from: String!, To: String!, message: String!): Chat
      addUser(name: String!, email: String!, friends: [Int]): User
    }

    type Subscription {
      messageSent: Chat
      userAdded: User
    }
  `
module.exports = typeDefs;