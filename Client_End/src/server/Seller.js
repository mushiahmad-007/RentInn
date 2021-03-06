import { seller_Actions } from '../constants/Seller'
import store from '../store/index'
import { ROOT_URL } from '../constants/config';

export const SellerServer = {
    handleRegister: handleRegister,
    handleProperty: handleProperty,
    handleUser:handleUser
}

export function handleRegister(username, password, email, phoneNo) {
    var user = { 'name': username, 'password': password, 'email': email, 'phoneNo': phoneNo }
    fetch(ROOT_URL + '/api/Accounts/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        mode: 'cors',
        body: JSON.stringify(user)
    })
        .then((response) => {
            console.log('********' + response.status);
            response.json()
                .then(data => {
                    console.log(data.registerStatus)
                    if (data.registerStatus === 'failure') {
                        return;
                    }
                    else if (data.registerStatus === 'created') {
                        store.dispatch({ type: seller_Actions.seller_SignIn.SELLER_DATA, payload: data });
                        return;
                    }
                    else if (data.registerStatus === 'existing') {
                        store.dispatch({ type: seller_Actions.seller_SignIn.EXISTING, payload: data });
                        return;
                    }
                });
        })
    return { type: seller_Actions.seller_SignIn.NEW, payload: 'none' };
};
export function handleUser(userId) {


    const postRequest = fetch(ROOT_URL + '/api/RentINN/GetSpecificUser/' + userId, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        mode: 'cors',
    }).then((response) => {
        response.json().then(data => {
            if (data.getStatus == 'failed') {
                store.dispatch({ type:seller_Actions.seller_SignIn.FAILURE, payload: data });
                return;
            }
            else {
                store.dispatch({ type: seller_Actions.seller_SignIn.MAIN, payload: data });
                return;
            }
        });
    })
    return { type: seller_Actions.seller_SignIn.NEW, payload: 'none' };
};

export function handleProperty(OwnerId, lat, lan, Address, propertType, Bedrooms, Bathrooms, Garage, Ac, rent, MainImage, size, province,city) {
    var user = {
        "OwnerId": OwnerId, "lat": lat, "lan": lan, "Address": Address, "PropertyType": propertType,
        "Bedrooms": Bedrooms, "Bathrooms": Bathrooms, "Garage": Garage, "AC": Ac, "rent": rent,
        "MainImage": MainImage, "Area": size, "Province": province, "City": city
    }
    fetch(ROOT_URL + '/api/RentINN/UploadProperty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        mode: 'cors',
        body: JSON.stringify(user)
    })
        .then((response) => {
            response.json()
                .then(data => {
                    console.log(data.PropertyUpload)
                    if (data.PropertyUpload === 'failure') {
                        return;
                    }
                    else if (data.PropertyUpload === 'successful') {
                        store.dispatch({ type: seller_Actions.seller_SignIn.SUCCESS, payload: data });
                        return;
                    }
                });
        })
    return { type: seller_Actions.seller_SignIn.NEW, payload: 'none' };
};