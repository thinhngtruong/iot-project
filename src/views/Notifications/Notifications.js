/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import Snackbar from "components/Snackbar/Snackbar.js";
import * as firebase from 'firebase'

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    }
};


class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifi: [],
            openAlert: false
        }
        // let tempValue = JSON.parse(localStorage.getItem("tempPerDay"));
        // let { notifi } = this.state
        // console.log(tempValue)
        // tempValue.forEach((data, index) => {
        //     if (data >= 37) {
        //         let noti = {};
        //         if (index < 30) {
        //             noti = { day: `Nhiệt độ ngày ${index + 1} tháng 10 là ${data}°C vượt quá mức cho phép`,isSeen: false, type: "danger" }
        //         }
        //         else if (index >= 31 && index < 61) {
        //             noti = { day: `Nhiệt độ ngày ${index - 31} tháng 11 là ${data}°C vượt quá mức cho phép`,isSeen: false, type: "danger" }
        //         }
        //         else {
        //             noti = { day: `Nhiệt độ ngày ${index - 60} tháng 12 là ${data}°C vượt quá mức cho phép`,isSeen: false, type: "danger" }
        //         }
        //         notifi.push(noti);
        //         this.setState({
        //             notifi
        //         })
        //     }
        //     if (data < 23) {
        //         let noti = {};
        //         if (index < 30) {
        //             noti = { day: `Nhiệt độ ngày ${index + 1} tháng 10 là ${data}°C dưới mức cho phép`, isSeen: false, type: "info" }
        //         }
        //         else if (index >= 31 && index < 61) {
        //             noti = { day: `Nhiệt độ ngày ${index - 31} tháng 11 là ${data}°C dưới mức cho phép`, isSeen: false, type: "info" }
        //         }
        //         else {
        //             noti = { day: `Nhiệt độ ngày ${index - 60} tháng 12 là ${data}°C dưới mức cho phép`, isSeen: false, type: "info" }
        //         }
        //         notifi.push(noti);
        //         this.setState({
        //             notifi
        //         })
        //     }
        //     if (data === 30) {
        //         let noti = {};
        //         if (index < 30) {
        //             noti = { day: `Nhiệt độ ngày ${index + 1} tháng 10 là ${data}°C đạt mức lí tưởng`, isSeen: false, type: "success" }
        //         }
        //         else if (index >= 31 && index < 61) {
        //             noti = { day: `Nhiệt độ ngày ${index - 31} tháng 11 là ${data}°C đạt mức lí tưởng`, isSeen: false, type: "success" }
        //         }
        //         else {
        //             noti = { day: `Nhiệt độ ngày ${index - 60} tháng 12 là ${data}°C đạt mức lí tưởng`, isSeen: false, type: "success" }
        //         }
        //         notifi.push(noti);
        //         let updates = {};
        //         updates['/Notification/'] = notifi;
        //         firebase.database().ref().update(updates);
        //         this.setState({
        //             notifi: notifi.reverse()
        //         })
        //     }
        // });
    }

    componentDidMount() {

    }

    deleteNotify = (index) => {
        let { notifi } = this.state;
        notifi.reverse().splice(index, 1);
        this.setState({
            notifi: notifi.reverse(),
            openAlert: true
        })
        let updates = {};
        updates['/Notification/'] = notifi.reverse();
        firebase.database().ref().update(updates);
    }

    componentDidMount() {
        const rootRef = firebase.database().ref()
        const notification = rootRef.child("Notification")
        notification.on("value", snap => {
            if (snap.val() !== null) {
                this.setState({
                    notifi: snap.val().reverse()
                })
            }

        })
    }

    render() {
        let { classes } = this.props;
        return (
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite} style={{ textAlign: "center", fontWeight: "bold" }}>THÔNG BÁO</h4>
                </CardHeader>
                <CardBody>
                    <Snackbar
                        place="br"
                        color="success"
                        message="Xóa thành công!!!"
                        open={this.state.openAlert}
                        closeNotification={() => this.setState({ openAlert: false })}
                        close
                    />
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <div style={{ color: "#a8a1a1", fontSize: "16px", fontStyle: "italic" }}>
                                Những thông báo gần nhất:
                            </div>
                            <br />
                            {this.state.notifi.length === 0 ?
                                <div style={{ color: "#a8a1a1", fontSize: "16px" }}>Hiện không có thông báo nào!!!</div>
                                :
                                this.state.notifi.reverse().map((data, index) => {
                                    return (
                                        <div key={"abc" + index}>
                                            <SnackbarContent
                                                message={data.day}
                                                color={data.type}
                                            />
                                        </div>
                                    )
                                })}
                        </GridItem>
                        <GridItem xs={12} sm={12} md={5}>
                            <div style={{ color: "#a8a1a1", fontSize: "16px", fontStyle: "italic", marginBottom: "30px" }}>
                            </div>
                            <br />
                            {this.state.notifi.reverse().map((data, index) => {
                                return (
                                    <div key={"cde" + index} style={{ marginBottom: "32px" }}>
                                        <IconButton onClick={() => this.deleteNotify(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                )
                            })}
                        </GridItem>
                    </GridContainer>
                </CardBody>
            </Card>
        );
    }
}

export default withStyles(styles)(Notifications);
