import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BRAND } from '@/constants/brand';

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught error', error);
  }

  onReset = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.errorMessage ?? 'Please try again later.'}</Text>
          <TouchableOpacity style={styles.button} onPress={this.onReset} activeOpacity={0.85} testID="retry-button">
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAND.colors.navy,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: BRAND.colors.slate,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: BRAND.colors.green,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: BRAND.colors.navy,
    fontWeight: '700',
  },
});
