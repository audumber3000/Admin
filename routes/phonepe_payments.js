const axios = require('axios');
const crypto = require('crypto');

// Replace these values with your PhonePe credentials
const MERCHANT_ID = 'M22AWJC5OXCHL';
const MERCHANT_SALT = '47af02e6-3017-4b48-8a12-f446081228f4';
const BASE_URL = 'https://api.phonepe.com/apis/hermes/';

const createPaymentRequest = async (orderId, amount, callbackUrl) => {
    const payload = {
        "merchantId": 'M22AWJC5OXCHL',
        "merchantTransactionId": "MT7850590068188104",
        "merchantUserId": "MUID123",
        "amount": 10000,
        "redirectUrl": "https://webhook.site/redirect-url",
        "redirectMode": "REDIRECT",
        "callbackUrl": "https://webhook.site/callback-url",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
          "type": "PAY_PAGE"
        }
    };

    const requestPayload = JSON.stringify(payload);
    const base64Payload = Buffer.from(requestPayload).toString('base64');


    const endpoint = '/pg/v1/pay';
    const saltKey = '47af02e6-3017-4b48-8a12-f446081228f4';
    const saltIndex = 1;

    const concatenatedString = base64Payload + endpoint + saltKey;
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');

    const finalPayload = hash + '###' + saltIndex;
    console.log(finalPayload)

    const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': finalPayload
    };

    try {
        const response = await axios.post(`https://api.phonepe.com/apis/hermes/pg/v1/pay`,
         request = base64Payload, 
         { headers });
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', error.response.data);
            console.error('Status code:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        throw error;
    }
};

module.exports = {
    createPaymentRequest
};

// Example usage:
// createPaymentRequest('order123', 10000, 'https://yourcallbackurl.com')
//     .then(response => console.log('Payment Request Response:', response))
//     .catch(error => console.error('Payment Request Error:', error));
