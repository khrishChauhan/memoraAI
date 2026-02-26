import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';

import AIScreen from '../screens/AIScreen';
import FilesScreen from '../screens/FilesScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = ({ scannedFiles, setScannedFiles }) => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Files') {
                            iconName = focused ? 'folder' : 'folder-outline';
                        } else if (route.name === 'AI') {
                            iconName = focused ? 'sparkles' : 'sparkles-outline';
                        }

                        return <Ionicons name={iconName} size={24} color={color} />;
                    },
                    tabBarActiveTintColor: '#6366F1',
                    tabBarInactiveTintColor: '#606060',
                    tabBarStyle: {
                        backgroundColor: '#121212',
                        borderTopColor: '#262626',
                        borderTopWidth: 1,
                        height: Platform.OS === 'ios' ? 88 : 70,
                        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                        paddingTop: 10,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                        marginBottom: Platform.OS === 'ios' ? 0 : 4,
                    },
                    tabBarShowLabel: true,
                })}
            >
                <Tab.Screen
                    name="Home"
                    options={{ tabBarLabel: 'Home' }}
                >
                    {(props) => <HomeScreen {...props} setScannedFiles={setScannedFiles} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Files"
                    options={{ tabBarLabel: 'Memory' }}
                >
                    {(props) => <FilesScreen {...props} scannedFiles={scannedFiles} setScannedFiles={setScannedFiles} />}
                </Tab.Screen>
                <Tab.Screen
                    name="AI"
                    options={{ tabBarLabel: 'Insights' }}
                >
                    {(props) => <AIScreen {...props} scannedFiles={scannedFiles} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
