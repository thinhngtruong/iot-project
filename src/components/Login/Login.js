import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
// import LockOutline from "@material-ui/icons/LockOutline";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import {
    container,
    cardTitle,
    whiteColor,
    grayColor
} from "assets/jss/material-dashboard-react.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import * as Firebase from 'firebase'

const styles = theme => ({
    container: {
        ...container,
        zIndex: "4",
        [theme.breakpoints.down("sm")]: {
            paddingBottom: "100px"
        }
    },
    cardTitle: {
        ...cardTitle,
        color: whiteColor
    },
    textCenter: {
        textAlign: "center"
    },
    justifyContentCenter: {
        justifyContent: "center !important"
    },
    customButtonClass: {
        "&,&:focus,&:hover": {
            color: whiteColor
        },
        marginLeft: "5px",
        marginRight: "5px"
    },
    inputAdornment: {
        marginRight: "18px"
    },
    inputAdornmentIcon: {
        color: grayColor[6]
    },
    cardHidden: {
        opacity: "0",
        transform: "translate3d(0, -60px, 0)"
    },
    cardHeader: {
        marginBottom: "20px"
    },
    socialLine: {
        padding: "0.9375rem 0"
    }
});



const useStyles = makeStyles(styles);

export default function LoginPage(props) {
    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("Đăng xuất thành công!!!")   
    const [color, setColor] = useState("success")
    let value = false;
    if (localStorage.getItem("isLogout") === "true") {
        value = true
        localStorage.removeItem("isLogout");
    }
    const [openAlert, setOpenAlert] = useState(value)
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const authenticate = provider => {
        const authProvider = new Firebase.auth[`${provider}AuthProvider`]();
        Firebase
            .auth()
            .signInWithPopup(authProvider)
            .then(authHandler);
    }

    const authHandler = async () => {
        await props.history.push('/admin/dashboard')
    };

    const handleChangeUsername = e => {
        setUsername(e.target.value);
    }

    const handleChangePassword = e => {
        setPassword(e.target.value);
    }

    const handleLogin = () => {
        if(username === "" || password === ""){
            setMessage("Nhập đầy đủ tên tài khoản và mật khẩu");
            setColor("danger")
            setOpenAlert(true)
        }
        else if (username === "admin" && password === "admin") {
            props.history.push('/admin/dashboard')
            localStorage.setItem("isLogin", true);
            localStorage.setItem("isLogout", false);
        }
        else {
            setMessage("Sai tên tài khoản hoặc mật khẩu");
            setColor("danger")
            setOpenAlert(true)
        }
    }

    return (
        <div className={classes.container}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={6} md={4}>
                    <form>
                        <Snackbar
                            place="tr"
                            color={color}
                            message={message}
                            open={openAlert}
                            closeNotification={() => setOpenAlert(false)}
                            close
                        />
                        <Card className={classes[cardAnimaton]}>
                            <CardHeader
                                className={`${classes.cardHeader} ${classes.textCenter}`}
                                color="rose"
                            >
                                <h4 className={classes.cardTitle}>ĐĂNG NHẬP</h4>
                            </CardHeader>
                            <CardBody>
                                <CustomInput
                                    labelText="Tên đăng nhập"
                                    id="firstname"
                                    defaultValue={username}
                                    onChange={handleChangeUsername}
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Face className={classes.inputAdornmentIcon} />
                                            </InputAdornment>
                                        ),
                                        autoFocus: true,
                                        autoComplete: "off"
                                    }}
                                />
                                <CustomInput
                                    labelText="Mật khẩu"
                                    id="password"
                                    defaultValue={password}
                                    onChange={handleChangePassword}
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className={classes.inputAdornmentIcon}>
                                                    lock_outline
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        type: "password",
                                        autoComplete: "off"
                                    }}
                                />
                            </CardBody>
                            <Button color="rose" simple size="lg"
                                onClick={() => handleLogin()}>
                                Đăng nhập
                                &nbsp;
                                <FingerprintIcon />
                            </Button>
                            <Button color="info" simple size="lg"
                                onClick={() => authenticate("Facebook")}>
                                Đăng nhập bằng FaceBook
                                &nbsp;
                                <LockOpenIcon />
                            </Button>
                            <CardFooter />
                        </Card>
                    </form>
                </GridItem>
            </GridContainer>
        </div>
    );
}
