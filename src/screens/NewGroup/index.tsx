import { useNavigation } from '@react-navigation/native';

import { useState } from 'react';

import { Button } from '@components/Button';

import { Header } from '@components/Header';

import { Highlight } from '@components/Highlight';

import { Input } from '@components/Input';

import * as S from './styles';


export function NewGroup() {

    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    function handleNew(){
        navigation.navigate('players', { group })
    }

    return (
        <S.Container>
            <Header showBackButton />

            <S.Content>
                <S.Icon />

                <Highlight
                    title='Nova turma'
                    subtitle='cria a turma para adicionar pessoas'
                />

                <Input 
                    placeholder='Nome da turma'
                    onChangeText={setGroup}
                />

                <Button
                    title='Criar'
                    style={{ marginTop: 20 }}
                    onPress={handleNew}
                />

            </S.Content>
        </S.Container>
    )
}