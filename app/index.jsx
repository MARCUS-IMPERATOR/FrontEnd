import { StripeProvider } from '@stripe/stripe-react-native';
import { Redirect } from 'expo-router';

const stripePubKey = 'pk_test_51RR7ot4Dg4q1dyxt0LAzFpuMOLJ2g0BfT79RJaBTziWSAdE7Iy11FZIgdR9PAURJAfC4d9dfe8bd07Z47nxz7aJS00p5UWluXt';

export default function Index() {
  return (
    <StripeProvider publishableKey={stripePubKey}>
      <Redirect href="/splash" />
    </StripeProvider>
  );
}