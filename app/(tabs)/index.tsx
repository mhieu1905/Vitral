import { Redirect } from 'expo-router';

export default function TabsIndex() {
  // Default landing inside tabs ("Home").
  // Change this to "/(tabs)/activity" if you want Activity as the default.
  return <Redirect href="/(tabs)/dashboard" />;
}