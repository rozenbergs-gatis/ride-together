import {StyleSheet, Text, View} from "react-native";
import {colors} from "../../constants/colors";
import Type from "./Type";
import {Entypo, FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

function TypeSection({type}) {

    return(
        <View style={styles.root}>
            <Type typeName={'Wood'}
                  icon={<Entypo name="tree" size={36} color={type === 'Wood' ? colors.secondary500 : "black"} />}
                  highlightType={type}/>
            <Type typeName={'Metal'}
                  icon={<Ionicons name="cog" size={36} color={type === 'Metal' ? colors.secondary500 : "black"} />}
                  highlightType={type}/>
            <Type typeName={'Concrete'}
                  icon={<FontAwesome name="square" size={36} color={type === 'Concrete' ? colors.secondary500 : "black"} />}
                  highlightType={type}/>
            <Type typeName={'Dirt'}
                  icon={<MaterialCommunityIcons name="shovel" size={36} color={type === 'Dirt' ? colors.secondary500 : "black"} />}
                  highlightType={type}/>
            <Type typeName={'DIY'}
                  icon={<MaterialCommunityIcons name="hammer-wrench" size={36} color={type === 'DIY' ? colors.secondary500 : "black"} />}
                  highlightType={type}/>
        </View>
    );
}

export default TypeSection;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})