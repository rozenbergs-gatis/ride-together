import {StyleSheet, Text, View} from "react-native";
import {colors} from "../../constants/colors";

function OpenHours({skateparkHours}) {
    let hours = {}

    if (typeof skateparkHours === 'string') {
        hours.monday = '24 hours'
        hours.tuesday = '24 hours'
        hours.wednesday = '24 hours'
        hours.thursday = '24 hours'
        hours.friday = '24 hours'
        hours.saturday = '24 hours'
        hours.sunday = '24 hours'
    }
    else {
        hours = skateparkHours
    }

    return (
        <View style={styles.root}>
            <View style={styles.daysContainer}>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>M</Text>
                </View>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>T</Text>
                </View>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>W</Text>
                </View>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>Th</Text>
                </View>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>F</Text>
                </View>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>Sa</Text>
                </View>
                <View style={styles.daysInnerContainer}>
                    <Text style={styles.daysContainerText}>Su</Text>
                </View>
            </View>
            <View style={styles.hoursContainer}>
                <View style={styles.hoursInnerContainer}>
                    <Text style={styles.hoursContainerText}>{hours.monday}</Text>
                </View>
                <View style={styles.hoursInnerContainerEven}>
                    <Text style={styles.hoursContainerText}>{hours.tuesday}</Text>
                </View>
                <View style={styles.hoursInnerContainer}>
                    <Text style={styles.hoursContainerText}>{hours.wednesday}</Text>
                </View>
                <View style={styles.hoursInnerContainerEven}>
                    <Text style={styles.hoursContainerText}>{hours.thursday}</Text>
                </View>
                <View style={styles.hoursInnerContainer}>
                    <Text style={styles.hoursContainerText}>{hours.friday}</Text>
                </View>
                <View style={styles.hoursInnerContainerEven}>
                    <Text style={styles.hoursContainerText}>{hours.saturday}</Text>
                </View>
                <View style={styles.hoursInnerContainer}>
                    <Text style={styles.hoursContainerText}>{hours.sunday}</Text>
                </View>
            </View>
        </View>
    );
}

export default OpenHours;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center'
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colors.primary400,
        width: '90%',
        height: '30%',
        marginTop: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    daysInnerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    daysContainerText: {
        color: colors.secondary500
    },
    hoursContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: colors.primary400,
        width: '90%',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        height: '50%'
    },
    hoursInnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary800
    },
    hoursInnerContainerEven: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary900
    },
    hoursContainerText: {
        color: colors.whiteDefault,
    },
})