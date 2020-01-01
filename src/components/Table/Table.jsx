import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const CustomTableCell = withStyles(theme => ({
  head: {
    color: theme.palette.common.inherit,
    fontSize: '18px',
  },
  body: {
    fontSize: '18px',
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  grow: {
    flexGrow: 1,
    fontSize: '18px',
  },
  button: {
    marginLeft: theme.spacing.unit * 70,
    color: 'inherit',
  },
  friend: {
    marginLeft: theme.spacing.unit * 5,
  },
  strip: {
    cursor: 'pointer',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  table: {
    textSize: '18px',
    width: '25%',
    margin: theme.spacing.unit * 4,
    color: theme.palette.primary,
    align: 'center',
  }, 
});

class TableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  componentDidMount() {
    const { subscribe } = this.props;
    subscribe();
  };

  handleOpenChatBox = (details) => {
    const { onSelect } = this.props;
    onSelect(details);
  };

  render() {
    const {
      data,
      classes,
      name,
    } = this.props;
    return (
      <Paper className={classes.root}>
        <div>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {`Welcome ${name}`}
              </Typography>
              <Typography variant="h6" color="inherit">
                Available Friends
              </Typography>
              <Typography variant="h6" color="inherit">
                <Link to="/" component={RouterLink} color="inherit" underline="none">
                  <Button className={classes.button}>LOGOUT</Button>
                </Link>
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div align="center" className={classes.friend}>
          <Table className={classes.table}>
            <TableBody>
              {data.map((friends) => (
                <TableRow
                  className={classes.strip}
                  hover
                  onClick={() => this.handleOpenChatBox(friends)}
                >
                  <CustomTableCell align="center">{friends.name}</CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  };
};

TableData.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(TableData);