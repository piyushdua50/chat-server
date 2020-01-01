import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as yup from 'yup';
import { Dialog } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import { Mutation } from 'react-apollo';
import gql from "graphql-tag";
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackBarConsumer } from '../../contexts/SnackBarProvider/SnackBarProvider';
import { TextField, InputAdornment, Button } from '@material-ui/core';

const Schema = yup.object({
    name: yup.string().required().label('Name'),
    email: yup.string().email('Email must be a valid Email').required('Email is a required field'),
});

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
        width: '100%',
        marginTop: (theme.spacing.unit) * 4,
    },
    submit: {
        marginTop: theme.spacing.unit * 6,
    },
});

const ADD_USER = gql`
  mutation($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
class AddFriend extends Component {
    state = {
        errors: {},
        touched: {},
        email: '',
        name: '',
    };

    handleChange = (field) => (event) => {
        this.setState({
            [field]: event.target.value,
        }, this.handleValidate);
    };

    handleBlur = (index) => () => {
        const { touched } = this.state;
        touched[index] = true;
        this.setState({
            touched,
        }, () => this.handleValidate());
    };

    handleValidate = () => {
        const {
            email,
            name,
        } = this.state;
        Schema.validate({
            email,
            name,
        }, { abortEarly: false })
            .then(() => {
                this.handleErrors(null);
            })
            .catch((errors) => {
                this.handleErrors(errors);
            });
    };

    handleErrors = (errors) => {
        const catchErrors = {};
        if (errors) {
            errors.inner.forEach((error) => {
                catchErrors[error.path] = error.message;
            });
        }
        this.setState({
            errors: catchErrors,
        });
    };

    getError = (field) => {
        const { errors, touched } = this.state;
        if (!touched[field]) {
            return null;
        }
        const err = '';
        return errors[field] || err;
    };

    hasErrors = () => {
        const { errors } = this.state;
        return Object.keys(errors).length !== 0;
    };

    isTouched = () => {
        const { touched } = this.state;
        return Object.keys(touched).length !== 0;
    };

    handleSubmit = (addUser, openSnackbar) => {
        const { onSubmit, onClose } = this.props;
        const { name, email } = this.state;
        addUser({ variables: { name, email } }).then((result => {
            if (result.data.addUser) {
                const { name, email } = result.data.addUser;
                const data = { name, email };
                onSubmit(data);
                openSnackbar('User Successfully Created', 'success');
            } else {
                onClose();
                openSnackbar('Username already Exists', 'error');
            }
        }));
        this.setState({
            name: '',
            email: '',
            disabled: true,
        });
    };

    render() {
        const {
            classes,
            open,
            onClose,
        } = this.props;

        const {
            email,
            name,
        } = this.state;

        return (
            <SnackBarConsumer>
                {({ openSnackbar }) => (
                    <Mutation mutation={ADD_USER}>
                        {(addUser) => (
                            <Dialog open={open} onClose={onClose}>
                                <main className={classes.main}>
                                    <CssBaseline />
                                    <Paper className={classes.paper}>
                                        <Typography component="h1" variant="h6" padding="40px">
                                            ADD User
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            className={classes.form}
                                            variant="outlined"
                                            label="Name"
                                            type="text"
                                            value={name}
                                            onChange={this.handleChange('name')}
                                            onBlur={this.handleBlur('name')}
                                            error={this.getError('name')}
                                            helperText={this.getError('name')}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            className={classes.form}
                                            variant="outlined"
                                            label="Email"
                                            type="email"
                                            value={email}
                                            fullWidth
                                            onChange={this.handleChange('email')}
                                            onBlur={this.handleBlur('email')}
                                            error={this.getError('email')}
                                            helperText={this.getError('email')}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            className={classes.submit}
                                            fullWidth
                                            color="primary"
                                            onClick={() => this.handleSubmit(addUser, openSnackbar)}
                                            variant="contained"
                                            disabled={this.hasErrors() || !this.isTouched()}
                                        >
                                            START
                                        </Button>
                                    </Paper>
                                </main>
                            </Dialog>
                        )}
                    </Mutation>
                )}
            </SnackBarConsumer>
        );
    };
};

AddFriend.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(AddFriend);