import { Table, ChatBox } from '../components';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from "graphql-tag";

const GET_USERS = gql`
  query($name: String!) {
    getAllUser(name: $name) {
        id,
        name,
        email
    }
  }
`;

const USER_SUBSCRIPTION = gql`
  subscription {
    userAdded {
      id
      name
      email
    }
  }
`;
class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openChatBox: false,
            friendDetail: '',
        }
    };
    onSelect = (details) => {
        this.setState({
            openChatBox: true,
            friendDetail: details,
        })
    };

    onClose = () => {
        this.setState({
            openChatBox: false,
        })
    };

    subscribeUser = (subscribeToMore) => {
        subscribeToMore({
            document: USER_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newData = subscriptionData.data.userAdded;
                const data = Object.assign({}, prev, {
                    getAllUser: [...prev.getAllUser, newData]
                });
                return data;
            },
        });
    };

    render() {
        const { openChatBox, friendDetail } = this.state;
        const { match } = this.props;
        const { name } = match.params;
        return (
            <>
                <Query query={GET_USERS} variables={{ name }}>
                    {({ subscribeToMore, loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return `Error! ${error.message}`;
                        const records = data.getAllUser;
                        return (
                            <>
                                <Table
                                    data={records}
                                    subscribe={() => this.subscribeUser(subscribeToMore)}
                                    onSelect={this.onSelect}
                                    name={name} 
                                />
                                <ChatBox
                                    open={openChatBox}
                                    onSubmit={this.handleSubmit}
                                    onClose={this.onClose}
                                    data={friendDetail}
                                    from={name}
                                />
                            </>
                        );
                    }}
                </Query>
            </>
        )
    };
};

export default UserDetails;