import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons'
import { FlatList, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import logoImg from '../../assets/logo.png'
import styles from './styles';
import api from '../../services/api';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents() {
        if (loading) {
            return;
        }

        if (total > 0 && incidents.length === total) {
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });

        setLoading(false);
        setPage(page + 1);

        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return(
        // HEADER
        <View style={styles.container}>
            <View style={styles.header} >
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total of <Text style={styles.headerTextBold}>{total}</Text> incidents
                </Text>
            </View>
        
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.description}>Choose an incident and save the day!</Text>

            <FlatList 
                style={styles.incidentsList}
                data={incidents}
                keyExtractor={incident => String(incident)}
                // showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>INCIDENT:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALUE:</Text>
                        <Text style={styles.incidentValue}>
                            {Intl.NumberFormat('pt-BR', {
                                style: 'currency', 
                                currency:'BRL'
                            }).format(incident.value)}    
                        </Text>

                        <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToDetail(incident)}>
                            <Text style={styles.detailsButtonText}>See more details</Text>
                            <Feather name="arrow-right" size={16} color="#e02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        
        </View>
    )
}