import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { AddFriend } from '../AddFriend';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 35,
    fontSize: 20,
  },
});
class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  };

  openDialog = () => {
    this.setState({
      open: true,
    })
  };

  handleSubmit = (details) => {
    this.setState({
      open: false,
    });
    const { history } = this.props;
    const { name } = details;
    return (history.push(`/UserList/${name}`));
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={this.openDialog}
          className={classes.button}
        >
          Start Chat
        </Button>
        <AddFriend
          open={open}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  };
};

Buttons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Buttons);