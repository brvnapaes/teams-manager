import * as S from './styles';

import { Alert, FlatList, TextInput } from 'react-native';

import { useState, useEffect, useRef } from 'react';

import { AppError } from '@utils/AppError';

import { useRoute, useNavigation } from '@react-navigation/native';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';

import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';

import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';

import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';

import { groupRemoveByName } from '@storage/group/groupRemoveByName';

import { Header } from '@components/Header';

import { Highlight } from '@components/Highlight';

import { ButtonIcon } from '@components/ButtonIcon';

import { Input } from '@components/Input';

import { Filter } from '@components/Filter';

import { PlayerCard } from '@components/PlayerCard';

import { ListEmpty } from '@components/ListEmpty';

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

type RouteParams = {
    group: string;
}

export function Players(){

    const [isLoading, setIsLoading] = useState(true);

    const [newPlayerName, setNewPlayerName] = useState('');

    const [team, setTeam] = useState('time a');
    
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();

    const route = useRoute();

    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    type RouteParams = {
        group: string;
    }

    async function HandleAddPlayer(){
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar!');
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();

            setNewPlayerName('');

            fetchPlayersByTeam();
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar :(');
            }
        }
    }

    async function fetchPlayersByTeam(){
        try {
            setIsLoading(true);

            const playersByTeam = await playersGetByGroupAndTeam(group, team);

            setPlayers(playersByTeam);
        } catch (error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemovePlayer(playerName: string){
        try {
            await playerRemoveByGroup(playerName, group);

            fetchPlayersByTeam();
        } catch (error) {
            console.log(error);
            Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa :/');
        }
    }

    async function groupRemove(){
        try {
            await groupRemoveByName(group);

            navigation.navigate('groups');
        } catch (error) {
            console.log(error);
            Alert.alert('Remover turma', 'Não foi possível remover a turma.');
        }
    }

    async function handleGroupRemove(){
        Alert.alert(
            'Remover',
            'Deseja remover a turma?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() },
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return(
        <S.Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle='adicione a galera e separe os times'
            />

            <S.Form>
                <Input 
                    inputRef={newPlayerNameInputRef}
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    onSubmitEditing={HandleAddPlayer}
                    returnKeyType='done'
                />

                <ButtonIcon 
                    icon='add'
                    onPress={HandleAddPlayer}
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

            {
                isLoading? <Loading />
                :
                <FlatList 
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard 
                            name={item.name} 
                            onRemove={() => handleRemovePlayer(item.name)}
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
            }

            <Button 
                title='Remover turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />

        </S.Container>
    )
}