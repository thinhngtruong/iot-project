import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core";
import ChartistGraph from "react-chartist";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
    completedTasksChart,
    weekPerMonth
} from "variables/charts.js";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import * as Firebase from 'firebase'

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
        color: "white",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: grayColor[1],
            fontWeight: "400",
            lineHeight: "1"
        },
        textAlign: "center"
    },
    stats: {
        color: grayColor[0],
        display: "inline-flex",
        fontSize: "12px",
        lineHeight: "22px",
        "& svg": {
            top: "4px",
            width: "16px",
            height: "16px",
            position: "relative",
            marginRight: "3px",
            marginLeft: "3px"
        },
        "& .fab,& .fas,& .far,& .fal,& .material-icons": {
            top: "4px",
            fontSize: "16px",
            position: "relative",
            marginRight: "3px",
            marginLeft: "3px"
        }
    },
    cardTitle: {
        color: grayColor[2],
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: grayColor[1],
            fontWeight: "400",
            lineHeight: "1"
        }
    }
};


class TableList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            monthTemp: [],
        }
    }

    componentDidMount() {
        let { monthTemp } = this.state
        const db = Firebase.firestore();
        let totalHumiPerWeek = [0, 0, 0, 0];
        let totalTempPerWeek = [0, 0, 0, 0];
        let avgHumiPerWeek = [0, 0, 0, 0];
        let avgTempPerWeek = [0, 0, 0, 0];
        let i = 0;
        if (completedTasksChart.data.labels.length === 0) {
            db.collection('Temp').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let objMonth = { month: doc.id }
                    monthTemp.push(objMonth)
                    for (var key in doc.data()) {
                        let value = doc.data()[key];
                        completedTasksChart.data.labels.push("Ngày " + key);
                        completedTasksChart.data.series[0].push(value);
                    }
                    localStorage.setItem("tempPerDay", JSON.stringify(completedTasksChart.data.series[0]))
                    this.setState({
                        monthTemp: monthTemp,
                    })
                });
            })
            db.collection('Humi').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let objMonth = { month: doc.id }
                    monthTemp.push(objMonth)
                    for (var key in doc.data()) {
                        let value = doc.data()[key];
                        completedTasksChart.data.series[1].push(value);
                    }
                    localStorage.setItem("humiPerDay", JSON.stringify(completedTasksChart.data.series[1]))
                    this.setState({
                        monthTemp: monthTemp,
                    })
                });
            })

            let tempPerDay = JSON.parse(localStorage.getItem("tempPerDay"));
            let humiPerDay = JSON.parse(localStorage.getItem("humiPerDay"));
            for (let index = 0; index < tempPerDay.length; index++) {
                if (Math.floor(index / 7) === i && index < 28) {
                    totalHumiPerWeek[i] += humiPerDay[index];
                    totalTempPerWeek[i] += tempPerDay[index];
                    i++;
                }
                else {
                    totalHumiPerWeek[i - 1] += humiPerDay[index];
                    totalTempPerWeek[i - 1] += tempPerDay[index];
                }
            }
            for (let index = 0; index < totalHumiPerWeek.length; index++) {
                if (index < 3) {
                    avgHumiPerWeek[index] = Math.round(totalHumiPerWeek[index] / 7);
                    avgTempPerWeek[index] = Math.round(totalTempPerWeek[index] / 7);
                }
                else {
                    avgHumiPerWeek[index] = Math.round(totalHumiPerWeek[index] / 10);
                    avgTempPerWeek[index] = Math.round(totalTempPerWeek[index] / 10);
                }
                weekPerMonth.data.labels.push("Tuần " + (index + 1));
            }
            weekPerMonth.data.series[0] = avgTempPerWeek;
            weekPerMonth.data.series[1] = avgHumiPerWeek;
        }
    }

    render() {
        const { classes } = this.props
        const { monthTemp } = this.state;
        let monthName = ""
        if (monthTemp[0] !== undefined) {
            monthName = monthTemp[0].month
        }
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite} style={{ textAlign: "center", fontWeight: "bold" }}>
                                <EqualizerIcon />
                                &nbsp;
                                BIỂU ĐỒ THỐNG KÊ NHIỆT ĐỘ VÀ ĐỘ ẨM
                                &nbsp;
                            <EqualizerIcon />
                            </h4>
                        </CardHeader>
                        <div style={{ margin: "10px" }}></div>
                        <CardBody>
                            <GridItem sm={12}>
                                <Card chart>
                                    <CardHeader color="success">
                                        <ChartistGraph
                                            className="ct-chart"
                                            data={completedTasksChart.data}
                                            type="Line"
                                            options={completedTasksChart.options}
                                            listener={completedTasksChart.animation}
                                        />
                                    </CardHeader>
                                    <CardBody style={{ textAlign: "center" }}>
                                        <h4 className={classes.cardTitle}>Thống kê nhiệt độ theo ngày của Tháng {monthName}</h4>
                                    </CardBody>

                                </Card>
                            </GridItem>
                            <GridItem sm={12}>
                                <Card chart>
                                    <div style={{ margin: "20px" }}></div>
                                    <CardHeader color="warning">
                                        <ChartistGraph
                                            className="ct-chart"
                                            data={weekPerMonth.data}
                                            type="Bar"
                                            options={weekPerMonth.options}
                                            responsiveOptions={weekPerMonth.responsiveOptions}
                                            listener={weekPerMonth.animation}
                                        />
                                    </CardHeader>
                                    <CardBody style={{ textAlign: "center" }}>
                                        <h4 className={classes.cardTitle}>Thống kê nhiệt độ trung bình tuần của Tháng {monthName}</h4>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer >
        );
    }
}
export default withStyles(styles)(TableList)