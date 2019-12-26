import React, { useEffect } from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
// core components
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
import * as Firebase from 'firebase'

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
    const classes = useStyles();
    const [openNotification, setOpenNotification] = React.useState(null);
    const [openProfile, setOpenProfile] = React.useState(null);
    const [notify, setNotify] = React.useState(null);
    const [numberNotify, setNumberNotify] = React.useState(0);
    const handleClickNotification = event => {
        if (openNotification && openNotification.contains(event.target)) {
            setOpenNotification(null);
        } else {
            setOpenNotification(event.currentTarget);
        }
    };
    const handleCloseNotification = () => {
        setOpenNotification(null);
    };
    const handleClickProfile = event => {
        if (openProfile && openProfile.contains(event.target)) {
            setOpenProfile(null);
        } else {
            setOpenProfile(event.currentTarget);
        }
    };
    const handleCloseProfile = () => {
        setOpenProfile(null);
    };

    const handleLogOut = () => {
        Firebase.auth().signOut();
        localStorage.setItem("isLogin", false);
        localStorage.setItem("isLogout", true);
        localStorage.removeItem("firstLogin");
        window.location.href = "/";
    }

    const handleProfile = () => {
        window.location.href = "/admin/user";
    }

    const handleDashboard = () => {
        window.location.href = "/admin/dashboard";
    }

    useEffect(() => {
        const rootRef = Firebase.database().ref()
        const notification = rootRef.child("Notification")
        notification.on("value", snap => {
            if (snap.val() !== null) {
                let arrNotify = snap.val();
                let numberNotify = snap.val().length
                setNotify(arrNotify)
                setNumberNotify(numberNotify);
            }
            else {
                setNotify(null)
                setNumberNotify(0);
            }
        })
    }, []);

    const handleNotify = (data) => {
        setOpenNotification(null);
        let index = notify.findIndex(value => value === data)
        let newNotify = [...notify];
        newNotify.splice(index, 1);
        setNotify(newNotify)
        let updates = {};
        updates['/Notification/'] = newNotify;
        Firebase.database().ref().update(updates);
    }

    return (
        <div>
            <Button
                color={window.innerWidth > 959 ? "transparent" : "white"}
                justIcon={window.innerWidth > 959}
                simple={!(window.innerWidth > 959)}
                aria-label="Dashboard"
                className={classes.buttonLink}
                onClick={() => handleDashboard()}
            >
                <Dashboard className={classes.icons} />
                <Hidden mdUp implementation="css">
                    <p className={classes.linkText}>Dashboard</p>
                </Hidden>
            </Button>
            <div className={classes.manager}>
                <Button
                    color={window.innerWidth > 959 ? "transparent" : "white"}
                    justIcon={window.innerWidth > 959}
                    simple={!(window.innerWidth > 959)}
                    aria-owns={openNotification ? "notification-menu-list-grow" : null}
                    aria-haspopup="true"
                    onClick={handleClickNotification}
                    className={classes.buttonLink}
                >
                    <Notifications className={classes.icons} />
                    {
                        numberNotify !== 0 ? <span className={classes.notifications}>{numberNotify}</span> : null
                    }

                    <Hidden mdUp implementation="css">
                        <p onClick={handleCloseNotification} className={classes.linkText}>
                            Notification
            </p>
                    </Hidden>
                </Button>
                <Poppers
                    open={Boolean(openNotification)}
                    anchorEl={openNotification}
                    transition
                    disablePortal
                    className={
                        classNames({ [classes.popperClose]: !openNotification }) +
                        " " +
                        classes.popperNav
                    }
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="notification-menu-list-grow"
                            style={{
                                transformOrigin:
                                    placement === "bottom" ? "center top" : "center bottom"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseNotification}>
                                    <MenuList role="menu">
                                        {notify !== null ? (notify.map((data, index) => {
                                            if (index % 2 === 0) {
                                                return (
                                                    <MenuItem
                                                        key={"abc" + index}
                                                        className={classes.dropdownItem}
                                                        style={{ backgroundColor: "#d2ecef" }}
                                                        onClick={() => handleNotify(data)}
                                                    >
                                                        {data.day}
                                                    </MenuItem>
                                                )
                                            }
                                            else {
                                                return (
                                                    <MenuItem
                                                        key={"abc" + index}
                                                        className={classes.dropdownItem}
                                                        style={{ backgroundColor: "#96d8e0" }}
                                                        onClick={() => handleNotify(data)}
                                                    >
                                                        {data.day}
                                                    </MenuItem>
                                                )
                                            }
                                        })) :   
                                            <MenuItem
                                            className={classes.dropdownItem}
                                            onClick={handleCloseNotification}
                                            >
                                            Hiện chưa có thông báo nào!
                                        </MenuItem>
                                        }
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Poppers>
            </div>
            <div className={classes.manager}>
                <Button
                    color={window.innerWidth > 959 ? "transparent" : "white"}
                    justIcon={window.innerWidth > 959}
                    simple={!(window.innerWidth > 959)}
                    aria-owns={openProfile ? "profile-menu-list-grow" : null}
                    aria-haspopup="true"
                    onClick={handleClickProfile}
                    className={classes.buttonLink}
                >
                    <Person className={classes.icons} />
                    <Hidden mdUp implementation="css">
                        <p className={classes.linkText}>Profile</p>
                    </Hidden>
                </Button>
                <Poppers
                    open={Boolean(openProfile)}
                    anchorEl={openProfile}
                    transition
                    disablePortal
                    className={
                        classNames({ [classes.popperClose]: !openProfile }) +
                        " " +
                        classes.popperNav
                    }
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="profile-menu-list-grow"
                            style={{
                                transformOrigin:
                                    placement === "bottom" ? "center top" : "center bottom"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseProfile}>
                                    <MenuList role="menu">
                                        <MenuItem
                                            onClick={handleCloseProfile}
                                            className={classes.dropdownItem}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <FaceIcon />
                                            &nbsp;
                                            Xin chào, Admin
                    </MenuItem>
                                        <MenuItem
                                            onClick={() => handleProfile()}
                                            className={classes.dropdownItem}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <PermIdentityIcon />
                                            &nbsp;
                                            Thông tin tài khoản
                    </MenuItem>
                                        <Divider light />
                                        <MenuItem
                                            onClick={() => handleLogOut()}
                                            className={classes.dropdownItem}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <ExitToAppIcon />
                                            &nbsp;
                                            Đăng xuất
                    </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Poppers>
            </div>
        </div>
    );
}
