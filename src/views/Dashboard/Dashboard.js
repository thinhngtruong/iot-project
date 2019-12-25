import React, { Component } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from '@material-ui/core';
import AccessTime from "@material-ui/icons/AccessTime";
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TimelineIcon from '@material-ui/icons/Timeline';
import OpacityIcon from '@material-ui/icons/Opacity';
import AcUnitIcon from '@material-ui/icons/AcUnit';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { dailySalesChart, emailsSubscriptionChart } from "variables/charts.js";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import * as Firebase from 'firebase'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            humidity: 0,
            temp: 0,
            datetime: '',
            prevDateTime: '',
            updateTempTime: 0,
            updateHumiTime: 0,
            openAlert: false
        }
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            if (user && localStorage.firstLogin === undefined) {
                console.log(user)
                this.setState({
                    openAlert: true
                }, () => {
                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("firstLogin", true);
                })
            }
            else if (user) {
                localStorage.setItem("isLogin", true);
            }
            else if (localStorage.getItem("isLogout") === "true" || localStorage.getItem("isLogout") === null) {
                this.props.history.push("/");
            }
            else if (localStorage.firstLogin === undefined) {
                this.setState({
                    openAlert: true
                }, () => {
                    localStorage.setItem("isLogin", true);
                    localStorage.setItem("firstLogin", true);
                })
            }

        });
        const rootRef = Firebase.database().ref()
        const humidityValue = rootRef.child("Humidity")
        const tempValue = rootRef.child("Temp")
        const datetime = rootRef.child("DateTime")
        humidityValue.on("value", snap => {
            let deltaSecond = this.state.datetime.substr(17, 2) - this.state.prevDateTime.substr(17, 2)
            if (deltaSecond < 0 && deltaSecond > -58) {
                deltaSecond = 60 - this.state.prevDateTime.substr(17, 2)
            }
            console.log(this.state.datetime.substr(17, 2))
            console.log(this.state.prevDateTime.substr(17, 2))
            if (emailsSubscriptionChart.data.labels.length >= 12) {
                emailsSubscriptionChart.data.labels.splice(0, 1)
                emailsSubscriptionChart.data.series[0].splice(0, 1)
            }
            emailsSubscriptionChart.data.labels.push(this.state.datetime)
            emailsSubscriptionChart.data.series[0].push(snap.val().slice(0, 5))
            this.setState({
                humidity: snap.val(),
                updateHumiTime: deltaSecond
            })
        })
        tempValue.on("value", snap => {
            let deltaSecond = this.state.datetime.substr(17, 2) - this.state.prevDateTime.substr(17, 2)
            if (deltaSecond < 0) {
                deltaSecond = 60 - this.state.prevDateTime.substr(17, 2)
            }
            if (dailySalesChart.data.labels.length >= 12) {
                dailySalesChart.data.labels.splice(0, 1)
                dailySalesChart.data.series[0].splice(0, 1)
            }
            dailySalesChart.data.labels.push(this.state.datetime)
            dailySalesChart.data.series[0].push(snap.val().slice(0, 5))
            this.setState({
                temp: snap.val(),
                updateTempTime: deltaSecond
            })
        })
        datetime.on("value", snap => {
            this.setState({
                prevDateTime: this.state.datetime,
                datetime: snap.val()
            })
        })
    }

    render() {
        let { classes } = this.props
        let { humidity, temp, datetime, updateHumiTime, updateTempTime } = this.state

        return (
            <div>
                <GridContainer>
                    <GridItem xs={12}>
                        <Snackbar
                            place="tc"
                            color="success"
                            message="Đăng nhập thành công!!!"
                            open={this.state.openAlert}
                            closeNotification={() => this.setState({ openAlert: false })}
                            close
                        />
                        <Card>
                            <CardHeader color="warning" >
                                <h4 className={classes.cardTitleWhite}
                                    style={{ fontWeight: "bold" }}>
                                    <DesktopWindowsIcon
                                        className={classes.monitorIcon} />
                                    THEO DÕI NHIỆT ĐỘ, ĐỘ ẨM THỜI GIAN THỰC
                                    <DesktopWindowsIcon className={classes.monitorIcon} />
                                </h4>
                            </CardHeader>
                            <CardBody style={{ fontSize: "17px" }}>
                                <div>
                                    <LocationOnIcon /> Vị trí: thành phố Hồ Chí Minh
                                </div>
                                <div>
                                    <AccessTime />
                                    &nbsp;
                                    Thời gian đo được:
                                    &nbsp;
                                    {datetime === 0 ? 'None' : datetime}
                                </div>
                                <div>
                                    <OpacityIcon />
                                    &nbsp;
                                    Độ ẩm:
                                    &nbsp;
                                    {humidity === 0 ? 'None' : humidity}
                                </div>
                                <div>
                                    <AcUnitIcon />
                                    &nbsp;
                                    Nhiệt độ:
                                    &nbsp;
                                    {temp === 0 ? 'None' : temp}
                                </div>
                                <div>{this.state.displayName}</div>
                                <div>{this.state.email}</div>

                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite} style={{ fontWeight: "bold" }}>
                                    <TimelineIcon />
                                    &nbsp;
                                    BIỂU ĐỒ THAY ĐỔI NHIỆT ĐỘ, ĐỘ ẨM
                                    &nbsp;
                                    <TimelineIcon />
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <GridItem sm={12}>
                                    <Card chart>
                                        <div style={{ margin: "10px" }}></div>
                                        <CardHeader color="success">
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={dailySalesChart.data}
                                                type="Line"
                                                options={dailySalesChart.options}
                                                listener={dailySalesChart.animation}
                                            />
                                        </CardHeader>
                                        <CardBody style={{ textAlign: "center" }}>
                                            <h4 className={classes.cardTitle}>
                                                Biểu đồ nhiệt độ thời gian thực</h4>
                                            <div className={classes.stats}>
                                                <AccessTime /> updated {updateTempTime === 0 ? '...' : updateTempTime} seconds ago
                                            </div>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                                <GridItem sm={12}>
                                    <Card chart>
                                        <div style={{ margin: "20px" }}></div>
                                        <CardHeader color="info">
                                            <ChartistGraph
                                                className="ct-chart"
                                                data={emailsSubscriptionChart.data}
                                                type="Line"
                                                options={emailsSubscriptionChart.options}
                                                listener={emailsSubscriptionChart.animation}
                                            />
                                        </CardHeader>
                                        <CardBody style={{ textAlign: "center" }}>
                                            <h4 className={classes.cardTitle}>
                                                Biểu đồ độ ẩm thời gian thực</h4>
                                            <p className={classes.cardCategory}>
                                            </p>
                                            <div className={classes.stats}>
                                                <AccessTime /> updated {updateHumiTime === 0 ? '...' : updateHumiTime} seconds ago
                                            </div>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div >
        );
    }
}

export default withStyles(dashboardStyle)(Dashboard)
