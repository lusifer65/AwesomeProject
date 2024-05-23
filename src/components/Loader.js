import { ActivityIndicator } from "react-native";

export const Loader = ({ customStyle }) => {
    return (
        <ActivityIndicator size={'large'}
            style={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }, customStyle]}
        />)
}

export default Loader;