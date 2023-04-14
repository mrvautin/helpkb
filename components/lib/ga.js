import ReactGA from 'react-ga4';
if(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS){
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS);
}

export function gaTrack() {
    if(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS){
        ReactGA.send({
            hitType: 'pageview',
            page: window.location.pathname + window.location.search
        });
    }
}