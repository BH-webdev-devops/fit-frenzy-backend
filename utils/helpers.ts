export const getCurrentTimestamp = (): Promise<any> => {
    const currentTimestamp = new Date().toISOString();
    return Promise.resolve(currentTimestamp);
};