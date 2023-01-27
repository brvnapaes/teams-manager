import * as S from './styles';

import { useTheme } from 'styled-components/native';

import { TextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & {
    inputRef?: React.RefObject<TextInput>;
}

export function Input({ inputRef, ...rest }: Props){

    const { COLORS } = useTheme();

    return(
       <S.Container 
            ref={inputRef}
            placeholderTextColor={COLORS.GRAY_300}
            {...rest}
       /> 
    )
}
