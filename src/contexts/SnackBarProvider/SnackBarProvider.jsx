import React, { Component } from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import PropTypes from 'prop-types';

const SnackBarContext = React.createContext();
const styles = theme => ({
  response: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    opacity: 0.9,
    fontSize: 25,
    marginRight: theme.spacing.unit,
  },
  success: {
    backgroundColor: green[700],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
});

const Icons = {
  success: CheckCircleIcon,
  error: ErrorIcon,
};

class SnackBarProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      message: '',
      status: '',
    };
  };

  openSnackbar = (message, status) => {
    this.setState({
      message,
      status,
      isOpen: true,
    });
  };

  closeSnackbar = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { isOpen, message, status } = this.state;
    const Icon = Icons[status];
    const { classes, children } = this.props;
    return (
      <SnackBarContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
        }}
      >
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={isOpen}
          autoHideDuration={3000}
          onClose={this.closeSnackbar}
        >
          <SnackbarContent
            className={classes[status]}
            aria-describedby="client-snackbar"
            message={(
              <span id="client-snackbar" className={classes.response}>
                <Icon className={classes.icon} />
                {message}
              </span>
            )}
            action={[
              <IconButton key="close" onClick={this.closeSnackbar} color="inherit">
                <Close />
              </IconButton>,
            ]}
          />
        </Snackbar>
        {children}
      </SnackBarContext.Provider>
    );
  };
};

const propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  children: PropTypes.func.isRequired,
};

SnackBarProvider.propTypes = propTypes;
export const SnackBarConsumer = SnackBarContext.Consumer;
export default withStyles(styles)(SnackBarProvider);
