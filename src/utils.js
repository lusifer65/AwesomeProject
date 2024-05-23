import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentDateTime = () => {
    const currentDate = new Date().toJSON();
    return currentDate.split('.')[0];
}

export const storeUserId = async userId => {
    try {
        await AsyncStorage.setItem('Id', userId);
        console.log('User ID stored successfully:', userId);
    } catch (error) {
        console.error('Error storing user ID:', error);
    }
};

export const retrieveUserId = async () => {

    try {
        const userId = await AsyncStorage.getItem('Id');
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

    const headers = Object.keys(data[0]);
    const colWidths = {};
    headers.forEach(header => {
        colWidths[header] = header.length;
    });

    data.forEach(entry => {
        headers.forEach(header => {
            colWidths[header] = Math.max(colWidths[header], String(entry[header]).length);
        });
    });


    const rowFormat = headers.map(header => `{{:${colWidths[header]}}}`).join(" | ");


    let table = headers.map(header => header.padEnd(colWidths[header])).join(" | ");
    table += "\n" + headers.map(header => "-".repeat(colWidths[header])).join("-+-");


    data.forEach(entry => {
        const row = headers.map(header => String(entry[header]).padEnd(colWidths[header])).join(" | ");
        table += "\n" + row;
    });


    return table.split('\n').map(line => line.trim()).join('\n');
}

