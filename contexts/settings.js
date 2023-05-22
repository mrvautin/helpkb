import { createContext, useEffect, useState } from 'react';
import { apiReq } from '../components/lib/config';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [data, setData] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const [respMenu, respSettings] = await Promise.all([
                await apiReq().get('/api/menu'),
                await apiReq().get('/api/settings'),
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