import { format } from 'date-fns';
import axios from 'axios';
import { api } from './config';

export async function callApi(endpoint, type, payload, user) {
    let res;

    const headers = {
        'Content-Type': 'application/json'
    }

    // Set user if defined
    if(user){
        headers.apiKey = user.apiKey;
    }

    // Default options
    const options = {
        headers
    };
    
    // Set options for request ttype
    if(type === 'get'){
        options.method = 'GET';
    }
    if(type === 'post'){
        options.method = 'POST';
        options.body = JSON.stringify(payload);
    }

    // If admin, include credentials
    if(endpoint.includes('/admin/')){
        options.credentials = 'include';
    }

    // Call API
    res = await fetch(endpoint, options);

    // Check text first
    const resText = await res.text();
    
    // If not blank, we can parse
    if(resText !== ''){
        const data = JSON.parse(resText);
        if(data){
            return data;
        }
    }
    return {};
}

export function capsFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date, config) {
    const newDate = new Date(date);
    let dateFormat = 'dd/MM/yyyy hh:mmaaa';
    if(config && config.dateFormat && config.dateFormat !== ''){
        dateFormat = config.dateFormat
    }
    return format(newDate, dateFormat);
}