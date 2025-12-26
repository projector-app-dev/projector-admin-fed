import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import logo from "/src/assets/images/logo.png";
import type { Dayjs } from "dayjs";
import type { RecordType, WorkReportType } from "./WorkrReport.type";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffffff",
    padding: 60,
  },
  headerSection: {
    fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 20,
  },
  userSection: {
    marginTop: 10,
    fontFamily: "Roboto",
    textAlign: "left",
    fontSize: 12,
  },
  mainText: {
    fontSize: 9,
    fontWeight: 200,
    textAlign: "justify",
  },
  tableSection: {
    display: "flex",
    marginTop: 20,
    width: "100%",
    fontFamily: "Roboto",
  },
  mainSection: {
    marginTop: 10,
    fontFamily: "Roboto",
  },
  signSection: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    fontFamily: "Roboto",
  },
  tableRow: {
    display: "flex",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: "-1",
    width: "100%",
    flexDirection: "row",
  },
  tableNumberColumn: {
    display: "flex",
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  tableClientColumn: {
    display: "flex",
    width: "30%",
    borderLeftWidth: 1,
    borderLeftColor: "black",
    borderRightWidth: 1,
    borderRightColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  tableRecordColumn: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    textAlign: "justify",
    padding: 5,
  },
  logo: {
    width: "30%",
    height: "auto",
  },
  logoSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableText: {
    fontSize: 9,
    textAlign: "justify",
  },
});

const convertData = (data?: Dayjs) => {
  return data ? data.date() + "-" + data.month() + "-" + data.year() : "";
};

const WorkReport = (props: WorkReportType) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.logoSection}>
          <Image style={styles.logo} src={logo} />
        </View>
        <View style={styles.headerSection}>
          <Text>{props.projectName}</Text>
          <Text
            style={styles.mainText}
          >{`Звітність спеціаліста проєкту з ${convertData(
            props.startData
          )} по ${convertData(props.endData)}`}</Text>
        </View>
        <View style={styles.userSection}>
          <Text style={styles.mainText}>Спеціаліст:</Text>
          <Text>{props.userName}</Text>
        </View>
        {props.mainText && (
          <View style={styles.mainSection} wrap={false}>
            <Text style={styles.mainText}>{props.mainText}</Text>
          </View>
        )}
        <View style={styles.tableSection}>
          {props.records.map((record: RecordType, index: number) => (
            <View style={styles.tableRow} wrap={false}>
              <View style={styles.tableNumberColumn} wrap={false}>
                <Text style={styles.tableText}>{++index}</Text>
              </View>
              <View style={styles.tableClientColumn} wrap={false}>
                <Text style={styles.tableText}>{record.data}</Text>
                <Text style={styles.tableText}>{record.clientCode}</Text>
              </View>
              <View style={styles.tableRecordColumn} wrap={false}>
                <Text style={styles.tableText}>{record.record}</Text>
              </View>
            </View>
          ))}
        </View>
        {props.summeryText && (
          <View style={styles.mainSection} wrap={false}>
            <Text style={styles.mainText}>{props.summeryText}</Text>
          </View>
        )}
        <View style={styles.signSection} wrap={false}>
          <Text style={styles.mainText}>
            _________________________________ /
            _________________________________
            Погодженно/Зауважено_______________________
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default WorkReport;
