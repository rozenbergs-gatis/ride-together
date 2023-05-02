import {ScrollView, StyleSheet, Text, View} from "react-native";
import * as skateparks from '../../data/skateparks.json'
import Section from "../../components/Section";
import TypeSection from "../../components/skatepark/TypeSection";
import OpenHours from "../../components/skatepark/OpenHours";
import {Rating} from "react-native-ratings";

function SkateparkDetailsScreen({route, navigation}) {
    const skateparkId = route.params.skateparkId;
    const foundSkatepark = skateparks.default.find((skatepark) => skatepark.skatepark_id === skateparkId);

    function ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    return (
        <View style={styles.root}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                {/*<Image></Image>*/}
                <Section hideButton={true}>Type</Section>
                <View style={{flex: 2}}>
                    <TypeSection type={foundSkatepark.type}/>
                </View>
                <Section hideButton={true}>Open Hours</Section>
                <View style={{flex: 2}}>
                    <OpenHours skateparkHours={foundSkatepark.working_hours}/>
                </View>
                <Section hideButton={true}>Location</Section>
                <View style={{flex: 2}}>
                    <Text>{foundSkatepark.location_street}</Text>
                </View>
                <Section hideButton={true}>Rating</Section>
                <View style={{flex: 2}}>
                    <Rating
                        showRating
                        startingValue={foundSkatepark.rating}
                        readonly={true}
                        ratingTextColor={'black'}
                        style={{ paddingVertical: 10 }}
                        isDisabled={true}
                        imageSize={50}
                    />
                </View>
                {/*<Text>{foundSkatepark.name}</Text>*/}
            </ScrollView>
        </View>
    );
}

export default SkateparkDetailsScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1
    }
})