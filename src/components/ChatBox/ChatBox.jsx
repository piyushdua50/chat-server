import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, TextField, Button, DialogContent, IconButton } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    icon: {
        flexGrow: 1,
        marginLeft: theme.spacing.unit * 160,
    },
    main: {
        width: 'auto',
        margin: theme.spacing.unit * 4,
    },
    form: {
        width: '30%',
        marginLeft: theme.spacing.unit,
        marginTop: theme.spacing.unit * 4,
    },
    button: {
        marginTop: theme.spacing.unit * 7,
        marginLeft: theme.spacing.unit * 2,
    },
    field: {
        marginTop: theme.spacing.unit * 6,
        width: '90%',
    },
    foot: {
        bottom: 0,
    },
});

const ADD_MESSAGE = gql`
  mutation($message: String!, $from: String!, $To: String!) {
    sendMessage(message: $message, from: $from, To: $To) {
      id
      from
      To
      message
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messageSent {
      id
      from
      To
      message
    }
  }
`;

const GET_CHATS = gql`
  query($from: String, $To: String) {
    chats(from: $from, To: $To) {
      id
      from
      To
      message
    }
  }
`;

class ChatBox extends Component {
    constructor(props) {
        super(props);
        const { open } = this.props;
        this.state = {
            message: '',
            disabled: true,
            open: open,
        };
    }

    handleChange = (field) => (event) => {
        this.setState({
            disabled: false,
            [field]: event.target.value,
        });
        (event.target.value === '') 
        ? this.setState({ disabled: true })
        : this.setState({ disabled: false })
    };

    subscribeMessage = (subscribeToMore) => {
        subscribeToMore({
            document: MESSAGE_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newData = subscriptionData.data.messageSent;
                if (!prev.chats.find(user => user.id === newData.id)) {
                    const data = Object.assign({}, prev, {
                        chats: [...prev.chats, newData]
                    });
                    return data;
                } else {
                    return prev;
                }
            }
        });
    };

    handleSend = (sendMessage, event) => {
        const { message } = this.state;
        const { from, data } = this.props;
        const To = data ? data.name : '';
        sendMessage({ variables: { message, from, To } });
        this.setState({ message: '', disabled: true });
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    render() {
        const { classes, open, onClose, data, from } = this.props;
        const { message, disabled } = this.state;
        const To = data ? data.name : '';
        return (
            <>
                <Query query={GET_CHATS} variables={{ from, To }}>
                    {({ subscribeToMore, loading, error, data: chatData }) => {
                        if (loading) return 'Loading...';
                        if (error) return `Error! ${error.message}`;
                        this.subscribeMessage(subscribeToMore);
                        return (
                            <Dialog open={open} onClose={onClose} fullScreen>
                                <CssBaseline />
                                <AppBar position="static">
                                    <Toolbar>
                                        <Typography variant="h6" color="inherit">
                                            {To}
                                        </Typography>
                                        <IconButton
                                            className={classes.icon}
                                            key="close"
                                            aria-label="Close"
                                            color="inherit"
                                            onClick={this.handleClose}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Toolbar>
                                </AppBar>
                                <DialogContent>
                                    <main className={classes.main}>
                                        {chatData.chats.map(record =>
                                            from === record.from ? (
                                                <div style={{ textAlign: "end" }}>
                                                    <TextField
                                                        className={classes.form}
                                                        variant="outlined"
                                                        label={record.from}
                                                        type="text"
                                                        value={record.message}
                                                    />
                                                </div>
                                            ) : (
                                                    <div style={{ textAlign: "left" }}>
                                                        <TextField
                                                            className={classes.form}
                                                            variant="outlined"
                                                            label={record.from}
                                                            type="text"
                                                            value={record.message}
                                                        />
                                                    </div>
                                                )
                                        )}
                                    </main>
                                </DialogContent>
                                <Mutation mutation={ADD_MESSAGE}>
                                    {sendMessage => (
                                        <div className={classes.foot}>
                                            <TextField
                                                className={classes.field}
                                                variant="outlined"
                                                placeholder="Enter your message here...."
                                                type="text"
                                                value={message}
                                                onChange={this.handleChange('message')}
                                            />
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                size="large"
                                                className={classes.button}
                                                disabled={disabled}
                                                onClick={() => this.handleSend(sendMessage)}
                                            >
                                                Send
                                                </Button>
                                        </div>
                                    )}
                                </Mutation>
                            </Dialog>
                        );
                    }}
                </Query>
            </>
        );
    }
}

ChatBox.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(ChatBox);
