import { createContext, useEffect, useState } from 'react';
import { api, apiReq } from '../components/lib/config';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [data, setData] = useState();
    useEffect(() => {
        localStorage.setItem('admin', true);
        const fetchData = async () => {
            const [respMenu, respSettings] = await Promise.all([
                apiReq().get(`${api()}/api/menu`),
                apiReq().get(`${api()}/api/settings`)
            ]);
            const data = {
                menu: await respMenu.data,
                config: await respSettings.data
            }
            setData(data);
        }
        fetchData();
    }, []);


    if(!data){
        return <></>;
    }

    return (
        <SettingsContext.Provider value={data}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;