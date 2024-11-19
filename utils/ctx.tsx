import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState,
} from 'react';
import {
    CustomException,

} from './exception';
import {
    GeneralErrorDialog,
    GeneralErrorDialogProps,
} from '@/components/GeneralErrorDialog';

export const ErrorContext = createContext<{
    setUnhandledError: (error: Error) => void;
}>({
    setUnhandledError: (error: Error) => null,
});

// This hook can be used to access the user info.
export function useErrorContext() {
    const value = useContext(ErrorContext);
    return value;
}

export function ErrorProvider({ children }: PropsWithChildren) {
    const [error, setUnhandledError] = useState<undefined | Error>(undefined);
    const [isVisible, setIsVisible] = useState(false);
    const [handleProps, setHandleProps] = useState<
        Omit<GeneralErrorDialogProps, 'isVisible'> & {
            haveBackDropPress: boolean;
        }
    >({
        title: 'Default Title',
        content: 'Default Content',

        onClickPositiveBtn: () => {},
        haveBackDropPress: true,
    });
    if (error instanceof CustomException) {
        setIsVisible(true);
        setHandleProps(error.getDialogHandlerProps());
        setUnhandledError(undefined);
    }
    // } else if (error instanceof NetworkError) {
    //     setIsVisible(true);
    //     setHandleProps(error.getDialogHandlerProps());
    //     setUnhandledError(undefined);
    // }
    return (
        <ErrorContext.Provider value={{ setUnhandledError }}>
            <GeneralErrorDialog
                isVisible={isVisible}
                title={handleProps.title}
                content={handleProps.content}
                onClickPositiveBtn={() => {
                    handleProps.onClickPositiveBtn();
                    setIsVisible(false);
                }}
                onBackdropPress={
                    handleProps?.haveBackDropPress
                        ? () => setIsVisible(false)
                        : undefined
                }
            ></GeneralErrorDialog>
            {children}
        </ErrorContext.Provider>
    );
}
