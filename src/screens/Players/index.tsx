import * as S from './styles';

import { FlatList } from 'react-native';

import { useState } from 'react';

import { useRoute } from '@react-navigation/native';

import { Header } from '@components/Header';

import { Highlight } from '@components/Highlight';

import { ButtonIcon } from '@components/ButtonIcon';

import { Input } from '@components/Input';

import { Filter } from '@components/Filter';

import { PlayerCard } from '@components/PlayerCard';

import { ListEmpty } from '@components/ListEmpty';

import { Button } from '@components/Button';

type RouteParams = {
    group: string;
}

export function Players(){

    const [team, setTeam] = useState('time a');
    
    const [players, setPlayers] = useState([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    return(
        <S.Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle='adicione a galera e separe os times'
            />

            <S.Form>
                <Input 
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                />

                <ButtonIcon 
                    icon='add'
                />
            </S.Form>

            <S.HeaderList>
                <FlatList 
                    data={['time a', 'time b']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter 
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <S.Number>
                    {players.length}
                </S.Number>
            </S.HeaderList>

            <FlatList 
                data={players}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <PlayerCard 
                        name={item} 
                        onRemove={() => {}}
                    />
                )}
                ListEmptyComponent={() => (
                    <ListEmpty 
                        message='Não há pessoas nesse time'
                    />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    players.length === 0 && { flex: 1 }
                ]}
            />

            <Button 
                title='Remover turma'
                type='SECONDARY'
            />

        </S.Container>
    )
}