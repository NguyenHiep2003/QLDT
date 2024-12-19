import React, { createContext, useContext, useState } from 'react';

const UnreadCountContext = createContext({
    unreadCount: 0,
    setUnreadCount: (count: number) => {},
});

export const UnreadCountProvider = ({ children }: { children: React.ReactNode }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <UnreadCountContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </UnreadCountContext.Provider>
    );
};

export const useUnreadCount = () => useContext(UnreadCountContext);
