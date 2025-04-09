import apiClient from './axios'; // Importing axios client

export default async function server(endpoint = '', method = 'get', data = null) {
    //   await store.dispatch('setLoading', true); // Dispatch loading state

    let result: any, error: any;

    try {
        const response = await apiClient.request({
            url: endpoint,
            method: method,
            data: data,
        });
        result = response.data;
    } catch (err) {
        error = err;
    } finally {
    }

    return new Promise((resolve, reject) => {
        if (result) resolve(result);
        else reject(error);
    });
}
