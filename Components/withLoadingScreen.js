// src/components/withLoadingScreen.js
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LoadingLogo from './LoadingLogo'; // Adjust the path as needed

const withLoadingScreen = (WrappedComponent) => {
    return (props) => {
        const [isLoading, setIsLoading] = useState(true);

        useFocusEffect(
            React.useCallback(() => {
                setIsLoading(true);
                const timer = setTimeout(() => setIsLoading(false), 5000); // Increased to 5 seconds
                return () => clearTimeout(timer);
            }, [])
        );

        return isLoading ? <LoadingLogo /> : <WrappedComponent {...props} />;
    };
};

export default withLoadingScreen;
