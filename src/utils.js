import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentDateTime = () => {
    const currentDate = new Date().toJSON();
    return currentDate.split('.')[0];
}

export const storeUserId = async (value, filedName = "Id") => {
    try {
        await AsyncStorage.setItem(filedName, value);
        console.log('stored successfully:', value);
    } catch (error) {
        console.error('Error storing user ID:', error);
    }
};

export const retrieveUserId = async (fieldName = "Id") => {
    // storeUserId(1)
    // storeUserId('admin','user_type')
    try {
        const userId = await AsyncStorage.getItem(fieldName);
        if (userId !== null) {
            return userId;
        } else {
            console.log('No user ID stored in fn');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user ID:', error);
        return null;
    }
};



export const postRequest = async (url, body, callback) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        const data = await response.json();
        // console.log(data);
        callback(data)
    } catch (error) {
        console.error('Error:', error);
        callback({}, error)
    }
};


export const formatTable = (data) => {
    if (!data || !data.length || data.length == 0) {
        return 'No data available'
    }
    const headers = '(' + Object.keys(data[0]).join(', ') + ')';
    let body = ""
    for (let value of data) {
        console.log(value);
        body = body + "\n(" + Object.values(value).join(', ') + ")"
    }
    return headers + '\n' + body;
}

