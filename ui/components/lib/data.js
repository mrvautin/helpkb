import { format } from 'date-fns';
import matter from 'gray-matter';
import { stripHtml } from 'string-strip-html';

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

export function parseContent(article){
    // Parse our content
    const parsedContent = matter(article.content);
    parsedContent.data.content = parsedContent.content;

    // Set category
    if(!parsedContent.data.category){
        parsedContent.data.category = article.category || 'General';
    }

    // Fix date
    if(parsedContent.data.date){
        parsedContent.data.date = parsedContent.data.date.toString();
    }

    // SEO stuff
    parsedContent.data.url = `${process.env.NEXT_PUBLIC_BASE_URL}/article/${article.url}`;
    // If description not set, grab from our content
    if(!parsedContent.data.description){
        parsedContent.data.description = stripHtml(contentHtml).result.substring(0, 255).replace(/(\r\n|\n|\r)/gm, '');
    }
    // If no SEO title found in matter, set default
    if(!parsedContent.data.seoTitle){
        parsedContent.data.seoTitle = parsedContent.data.title;
    }

    return parsedContent.data;
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