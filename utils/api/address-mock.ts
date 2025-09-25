export interface Address {
    id: number
    name: string
    gender: string
    phone: string
    address: string
}
// 模拟数据存储
let addressList: Address[] = [
    {
        id: 1,
        name: "张三",
        gender: "先生",
        phone: "13888888888",
        address: "江苏省苏州市姑苏区苏州市博物馆"
    },
    {
        id: 2,
        name: "李四",
        gender: "女士",
        phone: "13888888888",
        address: "上海市浦东新区*******"
    }
]
export const getAddressList = (): Promise<Address[]> => {
    return Promise.resolve(addressList);
}
export const addAddress = (address: Address): Promise<boolean> => {
    const newId = addressList.length > 0 ? Math.max(...addressList.map(addr => addr.id)) + 1 : 1;
    address.id = newId;
    addressList.push(address);
    return Promise.resolve(true);
}
export const updateAddress = (address: Address): Promise<boolean> => {
    const index = addressList.findIndex(item => item.id === address.id);
    if (index !== -1) {
        addressList[index] = { ...address };
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
export const deleteAddress = (id: number): Promise<boolean> => {
    const initialLength = addressList.length;
    addressList = addressList.filter(item => item.id !== id);
    return Promise.resolve(addressList.length < initialLength);
}