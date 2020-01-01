const chats = [];
const User = [];
const USER_ADDED = "USER_ADDED";
const CHAT_CHANNEL = "CHAT_CHANNEL";

const resolvers = {
  Query: {
    chats(root, { from, To }, context) {
      return chats.filter(chat => ((chat.from === from) && (chat.To === To)) || ((chat.from === To) && (chat.To === from)));
    },

    getAllUser: (root, { name }, context) => {
      return User.filter(user => (user.name) !== name);
    },
  },

  Mutation: {
    sendMessage(root, { from, To, message }, { pubsub }) {
      const chat = { id: chats.length + 1, from, To, message };
      chats.push(chat);
      pubsub.publish("CHAT_CHANNEL", { messageSent: chat });
      return chat;
    },

    addUser: (parent, { name, email }, { pubsub }) => {
      const res = User.filter(user => (user.name === name))
      if(res.length === 0){
        const temp = {
          id: User.length + 1,
          name,
          email,
        };
        User.push(temp);
        pubsub.publish(USER_ADDED, { userAdded: temp });
        return temp;
      };
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(CHAT_CHANNEL);
      },
    },

    userAdded: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(USER_ADDED);
      },
    }
  },
};

module.exports = resolvers;
